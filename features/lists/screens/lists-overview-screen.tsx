import { renderScreenState } from "@/features/lists/utils/render-screen-state";
import { Header } from "@/features/lists/components/overview";
import { ThemedView } from "@/shared/components/themed-view";
import { useGroupLists } from "@/features/lists/queries/use-lists";
import { OverviewSectionList } from "../components/overview/overview-section-list";
import { ListSectionFilter } from "../components/overview/list-section-filter";
import { useState } from "react";
import { ListType } from "../constants/list-types-config";

export function ListsOverviewScreen() {
  const [listTypeFilter, setListTypeFilter] = useState<ListType | "all">("all");
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

  const content: React.ReactNode = stateContent ?? (
    <>
      <ListSectionFilter listTypeFilter={listTypeFilter} setListTypeFilter={setListTypeFilter} />
      <OverviewSectionList lists={lists} listTypeFilter={listTypeFilter} />
    </>
  );

  return (
    <ThemedView
      header={<Header isLoading={isPending} isFetching={isFetching} />}
      horizontalInset="none"
    >
      {content}
    </ThemedView>
  );
}
