export const LIST_TYPES = {
  todo: {
    label: "Todo",
    icon: "checkmark.circle.fill",
  },
  shopping: {
    label: "Shopping",
    icon: "cart.fill",
  },
  other: {
    label: "Other",
    icon: "list.bullet",
  },
} as const;

export type ListType = keyof typeof LIST_TYPES;

export type ListTypeIcon = (typeof LIST_TYPES)[ListType]["icon"];

export type ListTypeLabel = (typeof LIST_TYPES)[ListType]["label"];
