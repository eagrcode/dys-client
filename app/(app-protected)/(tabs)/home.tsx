import { ThemedView } from "@/shared/components/themed-view";
import { Summary } from "@/features/dashboard/components/summary";
import { Header } from "@/features/dashboard/components/header";
import { useGroupById } from "@/features/groups/queries/use-group-id";
import { useGroupMembers } from "@/features/members/queries/use-group-members";

function HomeScreen() {
  useGroupById();
  useGroupMembers();

  return (
    <ThemedView header={<Header />}>
      <Summary />
    </ThemedView>
  );
}

export default HomeScreen;
