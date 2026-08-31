import { renderScreenState } from "@/features/lists/utils/render-screen-state";
import { Header } from "@/features/lists/components/overview";
import { ThemedView } from "@/shared/components/themed-view";
import { useGroupLists } from "@/features/lists/queries/use-lists";
import { OverviewSectionList } from "../components/overview/overview-section-list";

export function ListsOverviewScreen() {
  const { data: lists = [], error, isPending, isError, refetch, isFetching } = useGroupLists();

  const stateContent = renderScreenState({
    isPending,
    isError,
    isFetching,
    error,
    refetch,
    isEmpty: lists.length === 0,
    isEmptyMessage: "Create your first list",
    type: "lists",
  });

  const content: React.ReactNode = stateContent ?? <OverviewSectionList lists={lists} />;

  return (
    <ThemedView
      header={<Header isLoading={isPending} isFetching={isFetching} />}
      horizontalInset="none"
    >
      {content}
    </ThemedView>
  );
}
