import { StyleSheet, FlatList, Pressable, useWindowDimensions, View } from "react-native";
import { useRouter, type Href } from "expo-router";
import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useGroupsProvider } from "@/lib/context/GroupsProvider";
import { useGroupLists } from "@/hooks/queries/useGroupLists";

type Feature = {
  name: string;
  icon: React.ComponentProps<typeof IconSymbol>["name"];
  route: Href;
  count: number;
  tag: string;
};

const Tile = ({ name, icon, route, count, tag }: Feature) => {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
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
            backgroundColor:
              Colors[colorScheme].homeTileColors[
                name as keyof (typeof Colors)[typeof colorScheme]["homeTileColors"]
              ],
          },
        ]}
      >
        <View>
          <ThemedText type="defaultSemiBold">{name}</ThemedText>
          <ThemedText style={{ fontSize: 14, opacity: 0.7 }}>{`${count} ${tag}`}</ThemedText>
        </View>

        <IconSymbol name={icon} size={36} color={Colors[colorScheme].icon} />
      </View>
    </Pressable>
  );
};

export const Dashboard = () => {
  const { selectedGroup } = useGroupsProvider();
  const { data: groupLists, isLoading: groupListsLoading } = useGroupLists(selectedGroup || "");

  const features: Feature[] = [
    {
      name: "Lists",
      icon: "list.bullet",
      route: "/(app-protected)/lists",
      count: groupLists?.length ?? 0,
      tag: "outstanding",
    },
    {
      name: "Calendar",
      icon: "calendar",
      route: "/(app-protected)/calendar",
      count: groupLists?.length ?? 0,
      tag: "upcoming",
    },
    {
      name: "Albums",
      icon: "photo.on.rectangle",
      route: "/(app-protected)/albums",
      count: groupLists?.length ?? 0,
      tag: "new",
    },
    {
      name: "HearthChat",
      icon: "message.fill",
      route: "/(app-protected)/text-channels",
      count: groupLists?.length ?? 0,
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
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
});
