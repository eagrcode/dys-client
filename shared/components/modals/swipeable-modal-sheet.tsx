import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo } from "react";
import { type Href, router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { BackHandler, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { radius, spacing } from "@/shared/theme/theme";

const DEFAULT_SHEET_HEIGHT_RATIO = 0.85;

type Props = {
  children: React.ReactNode;
  fallbackHref: Href;
  sheetHeightRatio?: number;
};

export type SwipeableModalSheetHandle = {
  dismiss: (afterDismiss?: () => void) => void;
};

export const SwipeableModalSheet = forwardRef<SwipeableModalSheetHandle, Props>(function ModalSheet(
  { children, fallbackHref, sheetHeightRatio },
  ref,
) {
  const theme = useCurrentTheme();
  const { height: windowHeight } = useWindowDimensions();
  const sheetHeight = windowHeight * (sheetHeightRatio ?? DEFAULT_SHEET_HEIGHT_RATIO);
  const sheetTranslateY = useSharedValue(sheetHeight);
  const scrimOpacity = useSharedValue(0);
  const isClosing = useSharedValue(false);

  const completeDismiss = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(fallbackHref);
  }, [fallbackHref]);

  const dismiss = useCallback(
    (afterDismiss?: () => void) => {
      if (isClosing.value) return;

      isClosing.value = true;
      scrimOpacity.value = withTiming(0, { duration: 160 });
      sheetTranslateY.value = withTiming(sheetHeight, { duration: 220 }, (finished) => {
        if (finished) {
          scheduleOnRN(afterDismiss ?? completeDismiss);
        }
      });
    },
    [completeDismiss, isClosing, scrimOpacity, sheetHeight, sheetTranslateY],
  );

  useImperativeHandle(ref, () => ({ dismiss }), [dismiss]);

  useEffect(() => {
    isClosing.value = false;
    scrimOpacity.value = withTiming(1, { duration: 180 });
    sheetTranslateY.value = withTiming(0, { duration: 220 });
  }, [isClosing, scrimOpacity, sheetTranslateY]);

  useFocusEffect(
    useCallback(() => {
      const backSubscription = BackHandler.addEventListener("hardwareBackPress", () => {
        dismiss();
        return true;
      });

      return () => backSubscription.remove();
    }, [dismiss]),
  );

  const sheetGesture = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(4)
        .onUpdate((event) => {
          if (isClosing.value) return;
          sheetTranslateY.value = Math.max(0, event.translationY);
        })
        .onEnd((event) => {
          const shouldDismiss = sheetTranslateY.value > sheetHeight * 0.15 || event.velocityY > 900;

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
    [dismiss, isClosing, sheetHeight, sheetTranslateY],
  );

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Math.max(0, sheetTranslateY.value) }],
  }));

  const scrimAnimatedStyle = useAnimatedStyle(() => ({
    opacity: scrimOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.scrim,
          scrimAnimatedStyle,
          { backgroundColor: theme.colors.overlay },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={() => dismiss()} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          sheetAnimatedStyle,
          {
            height: sheetHeight,
            backgroundColor: theme.colors.bgLayer1,
          },
        ]}
      >
        <SafeAreaView edges={["bottom"]} style={styles.safeArea}>
          <GestureDetector gesture={sheetGesture}>
            <View style={styles.handleContainer}>
              <View style={[styles.handle, { backgroundColor: theme.colors.borderStrong }]} />
            </View>
          </GestureDetector>

          {children}
        </SafeAreaView>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    width: "100%",
    borderTopLeftRadius: radius["3xl"],
    borderTopRightRadius: radius["3xl"],
    overflow: "hidden",
    elevation: 12,
    paddingBottom: spacing[16],
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: spacing[16],
  },
  handleContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: radius.full,
  },
});
