import type { IconName } from "@/shared/components/icon";

export const LIST_TYPES = {
  todo: {
    label: "Todo",
    icon: "list-checks",
  },
  shopping: {
    label: "Shopping",
    icon: "shopping-cart",
  },
  other: {
    label: "General",
    icon: "list-bullets",
  },
} as const satisfies Record<string, { label: string; icon: IconName }>;

export type ListType = keyof typeof LIST_TYPES;

export type ListTypeIcon = (typeof LIST_TYPES)[ListType]["icon"];

export type ListTypeLabel = (typeof LIST_TYPES)[ListType]["label"];
