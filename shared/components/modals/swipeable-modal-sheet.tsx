import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  type LayoutChangeEvent,
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { radius, spacing } from "@/shared/theme/theme";
import { ThemedText } from "@/shared/components/themed-text";

const SHEET_BOTTOM_GAP = spacing[16] * 3;

type Props = {
  children: React.ReactNode;
  onDismiss: () => void;
  title: string;
};

export type SwipeableModalSheetHandle = {
  dismiss: (afterDismiss?: () => void) => void;
};

export const SwipeableModalSheet = forwardRef<SwipeableModalSheetHandle, Props>(function ModalSheet(
  { children, onDismiss, title },
  ref,
) {
  const theme = useCurrentTheme();
  const { height: windowHeight } = useWindowDimensions();
  const measuredSheetHeight = useSharedValue(0);
  const sheetTranslateY = useSharedValue(windowHeight);
  const scrimOpacity = useSharedValue(0);
  const isClosing = useSharedValue(false);
  const measuredHeightRef = useRef(0);
  const hasModalShown = useRef(false);
  const hasPresented = useRef(false);
  const isMounted = useRef(false);
  const presentationFrameRef = useRef<number | null>(null);
  const afterDismissRef = useRef<(() => void) | undefined>(undefined);

  const completeDismiss = useCallback(() => {
    const afterDismiss = afterDismissRef.current;
    afterDismissRef.current = undefined;
    onDismiss();
    afterDismiss?.();
  }, [onDismiss]);

  const dismiss = useCallback(
    (afterDismiss?: () => void) => {
      if (isClosing.value) return;

      afterDismissRef.current = afterDismiss;
      isClosing.value = true;
      scrimOpacity.value = withTiming(0, { duration: 160 });
      const dismissDistance =
        measuredSheetHeight.value > 0 ? measuredSheetHeight.value + SHEET_BOTTOM_GAP : windowHeight;

      sheetTranslateY.value = withTiming(dismissDistance, { duration: 220 }, (finished) => {
        if (finished) {
          scheduleOnRN(completeDismiss);
        }
      });
    },
    [completeDismiss, isClosing, measuredSheetHeight, scrimOpacity, sheetTranslateY, windowHeight],
  );

  useImperativeHandle(ref, () => ({ dismiss }), [dismiss]);

  const presentIfReady = useCallback(() => {
    const measuredHeight = measuredHeightRef.current;

    if (
      !isMounted.current ||
      !hasModalShown.current ||
      measuredHeight <= 0 ||
      hasPresented.current ||
      isClosing.value
    ) {
      return;
    }

    hasPresented.current = true;
    sheetTranslateY.value = measuredHeight + SHEET_BOTTOM_GAP;
    scrimOpacity.value = 0;

    presentationFrameRef.current = requestAnimationFrame(() => {
      presentationFrameRef.current = null;
      if (!isMounted.current || isClosing.value) return;

      scrimOpacity.value = withTiming(1, { duration: 180 });
      sheetTranslateY.value = withTiming(0, { duration: 220 });
    });
  }, [isClosing, scrimOpacity, sheetTranslateY]);

  useEffect(() => {
    isMounted.current = true;
    presentIfReady();

    return () => {
      isMounted.current = false;

      if (presentationFrameRef.current !== null) {
        cancelAnimationFrame(presentationFrameRef.current);
        presentationFrameRef.current = null;
        hasPresented.current = false;
      }
    };
  }, [presentIfReady]);

  const handleSheetLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const measuredHeight = event.nativeEvent.layout.height;
      measuredHeightRef.current = measuredHeight;
      measuredSheetHeight.value = measuredHeight;
      presentIfReady();
    },
    [measuredSheetHeight, presentIfReady],
  );

  const handleModalShow = useCallback(() => {
    hasModalShown.current = true;
    presentIfReady();
  }, [presentIfReady]);

  const sheetGesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(4)
        .onUpdate((event) => {
          if (isClosing.value) return;
          sheetTranslateY.value = Math.max(0, event.translationY);
        })
        .onEnd((event) => {
          const shouldDismiss =
            sheetTranslateY.value > measuredSheetHeight.value * 0.15 || event.velocityY > 900;

          if (shouldDismiss) {
            scheduleOnRN(dismiss);
            return;
          }

          sheetTranslateY.value = withSpring(0, {
            damping: 22,
            stiffness: 240,
            overshootClamping: true,
          });
        })
        .onFinalize((_event, succeeded) => {
          if (succeeded || isClosing.value) return;

          sheetTranslateY.value = withSpring(0, {
            damping: 22,
            stiffness: 240,
            overshootClamping: true,
          });
        }),
    [dismiss, isClosing, measuredSheetHeight, sheetTranslateY],
  );

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Math.max(0, sheetTranslateY.value) }],
  }));

  const scrimAnimatedStyle = useAnimatedStyle(() => ({
    opacity: scrimOpacity.value,
  }));

  return (
    <Modal
      animationType="none"
      hardwareAccelerated
      navigationBarTranslucent
      onRequestClose={() => dismiss()}
      onShow={handleModalShow}
      presentationStyle="overFullScreen"
      statusBarTranslucent
      transparent
      visible
    >
      <GestureHandlerRootView style={styles.container}>
        <Animated.View
          style={[styles.scrim, scrimAnimatedStyle, { backgroundColor: theme.colors.overlay }]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={() => dismiss()} />
        </Animated.View>

        <View pointerEvents="box-none" style={styles.sheetPositioner}>
          <Animated.View
            onLayout={handleSheetLayout}
            style={[
              styles.sheet,
              sheetAnimatedStyle,
              { backgroundColor: theme.colors.background.layer1 },
            ]}
          >
            <GestureDetector gesture={sheetGesture}>
              <View
                style={[
                  styles.handleContainer,
                  { backgroundColor: theme.colors.background.primary },
                ]}
              >
                <ThemedText variant="subHeader" style={{ fontSize: 18 }}>
                  {title}
                </ThemedText>
                <View pointerEvents="none" style={styles.handlePositioner}>
                  <View
                    style={[
                      styles.handle,
                      {
                        backgroundColor: theme.colors.background.layer3,
                        borderColor: theme.colors.border.primary,
                        borderWidth: StyleSheet.hairlineWidth,
                      },
                    ]}
                  />
                </View>
              </View>
            </GestureDetector>

            <View style={styles.content}>{children}</View>
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sheetPositioner: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    paddingHorizontal: spacing[16],
    paddingBottom: SHEET_BOTTOM_GAP,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    flexShrink: 1,
    borderRadius: radius.lg,
    overflow: "hidden",
    elevation: 12,
    // paddingBottom: spacing[16],
  },
  content: {
    flexShrink: 1,
    paddingHorizontal: spacing[16],
    paddingVertical: spacing[8],
  },
  handleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[8],
    paddingVertical: spacing[12],
    paddingHorizontal: spacing[16],
  },
  handlePositioner: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: radius.full,
  },
});
