import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useDashboardData } from "@/hooks/queries/useDashboardData";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { useRouter, type Href } from "expo-router";
import { FlatList, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";

type Feature = {
  name: string;
  icon: React.ComponentProps<typeof IconSymbol>["name"];
  route: Href;
  count: number;
  tag: string;
};

export function Dashboard() {
  const { selectedGroup } = useGroupsProvider();
  const { lists, calendar, albums, messages } = useDashboardData(selectedGroup || "");

  const listsCount = lists.data?.count ?? 0;
  const calendarCount = calendar.data?.count ?? 0;
  const albumsCount = albums.data?.count ?? 0;
  const messagesCount = messages.data?.count ?? 0;

  const features: Feature[] = [
    {
      name: "Lists",
      icon: "list.bullet",
      route: "/(app-protected)/lists",
      count: listsCount,
      tag: "outstanding",
    },
    {
      name: "Calendar",
      icon: "calendar",
      route: "/(app-protected)/calendar",
      count: calendarCount,
      tag: "upcoming",
    },
    {
      name: "Albums",
      icon: "photo.on.rectangle",
      route: "/(app-protected)/albums",
      count: albumsCount,
      tag: "new",
    },
    {
      name: "HearthChat",
      icon: "message.fill",
      route: "/(app-protected)/text-channels",
      count: messagesCount,
      tag: "unread",
    },
  ];

  return (
    <FlatList
      data={features}
      numColumns={2}
      contentContainerStyle={dashboardStyles.grid}
      columnWrapperStyle={dashboardStyles.row}
      keyExtractor={(item) => item.name}
      renderItem={({ item }) => <Tile {...item} />}
    />
  );
}

const Tile = ({ name, icon, route, count, tag }: Feature) => {
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
            backgroundColor: (
              theme.colors.homeTileColors[name as keyof typeof theme.colors.homeTileColors] as {
                bg: string;
                border: string;
                icon: string;
                label: string;
              }
            ).bg,
            borderColor: (
              theme.colors.homeTileColors[name as keyof typeof theme.colors.homeTileColors] as {
                bg: string;
                border: string;
                icon: string;
                label: string;
              }
            ).border,
          },
        ]}
      >
        <View>
          <ThemedText variant="defaultSemiBold">{name}</ThemedText>
          <ThemedText style={{ fontSize: 14, opacity: 0.7 }}>{`${count} ${tag}`}</ThemedText>
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
