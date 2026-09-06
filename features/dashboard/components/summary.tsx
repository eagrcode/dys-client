import { ThemedText } from "@/shared/components/themed-text";
import { useDashboardData } from "@/features/dashboard/queries/use-dashboard-data";
import { Icon } from "@/shared/components/icon";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";
import { useRouter, type Href } from "expo-router";
import { spacing, radius } from "@/shared/theme/theme";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import type { UseQueryResult } from "@tanstack/react-query";
import type { DashboardCount } from "@/features/dashboard/types/dashboard-types";

type DashboardTileId = "lists" | "calendar" | "albums" | "chat";

type Feature = {
  id: DashboardTileId;
  name: string;
  icon: React.ComponentProps<typeof Icon>["name"];
  route: Href;
  label: string | null;
  featureDisabled: boolean;
  showLabelSkeleton: boolean;
};

type DashboardQueries = {
  lists: UseQueryResult<DashboardCount, Error>;
  calendar: UseQueryResult<DashboardCount, Error>;
  albums: UseQueryResult<DashboardCount, Error>;
  chat: UseQueryResult<DashboardCount, Error>;
};

const TILE_CONFIG = [
  {
    id: "lists",
    name: "Lists",
    icon: "list-ul-square",
    route: "/(app-protected)/lists/overview",
    tag: "Outstanding",
    featureDisabled: false,
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: "calendar-alt",
    route: "/(app-protected)/calendar",
    tag: "Coming soon",
    featureDisabled: true,
  },
  {
    id: "albums",
    name: "Albums",
    icon: "image-portrait",
    route: "/(app-protected)/albums",
    tag: "Coming soon",
    featureDisabled: true,
  },
  {
    id: "chat",
    name: "Chat",
    icon: "message-detail",
    route: "/(app-protected)/text-channels",
    tag: "Coming soon",
    featureDisabled: true,
  },
] as const;

function buildFeatures(queries: DashboardQueries): Feature[] {
  return TILE_CONFIG.map((tile) => {
    const query = queries[tile.id];

    const showLabelSkeleton = !tile.featureDisabled && query.isPending && !query.data;

    let label: string | null = null;

    if (tile.featureDisabled) {
      label = tile.tag;
    } else if (query.isError) {
      label = "Unavailable";
    } else if (query.data) {
      label = `${query.data.count} ${tile.tag}`;
    }

    return {
      id: tile.id,
      name: tile.name,
      icon: tile.icon,
      route: tile.route,
      label,
      featureDisabled: tile.featureDisabled,
      showLabelSkeleton,
    };
  });
}

export function Summary() {
  const { lists, calendar, albums, chat } = useDashboardData();

  const queries: DashboardQueries = {
    lists,
    calendar,
    albums,
    chat,
  };

  const features = buildFeatures(queries);

  return (
    <FlatList
      data={features}
      numColumns={2}
      columnWrapperStyle={styles.column}
      contentContainerStyle={styles.content}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Tile {...item} />}
    />
  );
}

function Tile({ name, icon, route, label, featureDisabled, showLabelSkeleton }: Feature) {
  const router = useRouter();
  const { colors } = useCurrentTheme();

  const handlePress = () => {
    if (!featureDisabled) {
      router.push(route);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.pressable,
        {
          opacity: pressed && !featureDisabled ? 0.7 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.tile,
          {
            borderRadius: radius.md,
            backgroundColor: colors.background.layer1,
            borderColor: colors.border.primary,
            opacity: featureDisabled ? 0.4 : 1,
          },
        ]}
      >
        <View>
          <ThemedText variant="subHeader" style={styles.title}>
            {name}
          </ThemedText>

          {showLabelSkeleton ? (
            <View
              style={[
                styles.labelSkeleton,
                {
                  backgroundColor: colors.background.layer3,
                },
              ]}
            />
          ) : (
            label && (
              <ThemedText variant="tag" style={styles.label}>
                {label}
              </ThemedText>
            )
          )}
        </View>

        <View style={styles.icon}>
          <Icon name={icon} size={30} fill={colors.icon.primary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  column: {
    gap: spacing[8],
  },
  content: {
    gap: spacing[8],
  },
  pressable: {
    flex: 1,
  },
  tile: {
    width: "100%",
    minHeight: 90,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: spacing[12],
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
  },
  label: {
    fontSize: 14,
  },
  labelSkeleton: {
    width: 80,
    height: 16,
    borderRadius: 2,
  },
  icon: {
    alignSelf: "flex-start",
  },
});
