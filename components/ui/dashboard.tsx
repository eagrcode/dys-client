import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useDashboardData } from "@/hooks/queries/useDashboardData";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { useRouter, type Href } from "expo-router";
import { FlatList, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import type { UseQueryResult } from "@tanstack/react-query";
import type { DashboardCount } from "@/utils/types/T_Dashboard";

type DashboardTileId = "lists" | "calendar" | "albums" | "messages";

type Feature = {
  id: DashboardTileId;
  name: string;
  icon: React.ComponentProps<typeof IconSymbol>["name"];
  route: Href;
  count: number;
  label: string;
  tag: string;
};

type DashboardQueries = {
  lists: UseQueryResult<DashboardCount, Error>;
  calendar: UseQueryResult<DashboardCount, Error>;
  albums: UseQueryResult<DashboardCount, Error>;
  messages: UseQueryResult<DashboardCount, Error>;
};

const TILE_CONFIG = [
  {
    id: "lists",
    name: "Lists",
    icon: "list",
    route: "/(app-protected)/lists",
    tag: "Outstanding",
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: "calendar",
    route: "/(app-protected)/calendar",
    tag: "Upcoming",
  },
  {
    id: "albums",
    name: "Albums",
    icon: "photo",
    route: "/(app-protected)/albums",
    tag: "Albums",
  },
  {
    id: "messages",
    name: "HearthChat",
    icon: "chat",
    route: "/(app-protected)/text-channels",
    tag: "Unread",
  },
] as const;

const buildFeatures = (queries: DashboardQueries): Feature[] => {
  return TILE_CONFIG.map((tile) => {
    const query = queries[tile.id];
    const count = query.data?.count ?? 0;
    const label = query.isPending
      ? "Loading"
      : query.isError
        ? "Unavailable"
        : `${count} ${tile.tag}`;

    return {
      ...tile,
      count,
      label,
    };
  });
};

export function Dashboard() {
  const { lists, calendar, albums, messages } = useDashboardData();

  const queries = { lists, calendar, albums, messages };

  const features = buildFeatures(queries);

  return (
    <FlatList
      data={features}
      numColumns={2}
      contentContainerStyle={dashboardStyles.grid}
      columnWrapperStyle={dashboardStyles.row}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Tile {...item} />}
    />
  );
}

const Tile = ({ name, icon, route, label }: Feature) => {
  const router = useRouter();
  const theme = useCurrentTheme();
  const { width } = useWindowDimensions();
  const tileWidth = (width - 48) / 2;

  return (
    <Pressable
      onPress={() => router.push(route)}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <View
        style={[
          tileStyles.tile,
          {
            width: tileWidth,
            borderRadius: theme.radius.lg,
            backgroundColor: theme.colors.bgLayer1,
            borderColor: theme.colors.border,
          },
          theme.shadow.xl,
        ]}
      >
        <View>
          <ThemedText variant="defaultSemiBold">{name}</ThemedText>
          <ThemedText style={{ fontSize: 14, opacity: 0.7 }}>{label}</ThemedText>
        </View>

        <IconSymbol
          name={icon}
          size={36}
          color={
            (
              theme.colors.homeTileColors[name as keyof typeof theme.colors.homeTileColors] as {
                bg: string;
                border: string;
                icon: string;
                label: string;
              }
            ).icon
          }
        />
      </View>
    </Pressable>
  );
};

const dashboardStyles = StyleSheet.create({
  grid: {
    gap: 16,
  },
  row: {
    justifyContent: "space-between",
  },
});

const tileStyles = StyleSheet.create({
  tile: {
    height: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
  },
});
