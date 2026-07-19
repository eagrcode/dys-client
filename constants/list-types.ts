import type { ListType } from "@/_features/lists/lists-types";

export const LIST_TYPES = ["todo", "shopping", "other"] as const;

export const LIST_TYPE_ICONS: Record<ListType, string> = {
  shopping: "cart.fill",
  todo: "checkmark.circle.fill",
  other: "list.bullet",
} as const;

export const LIST_TYPE_LABELS: Record<ListType, string> = {
  shopping: "Shopping",
  todo: "Todo",
  other: "Other",
} as const;
