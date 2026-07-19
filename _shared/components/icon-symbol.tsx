import { Feather } from "@react-native-vector-icons/feather";
import { MaterialIcons } from "@react-native-vector-icons/material-icons";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid";
import { SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type FeatherIconName = ComponentProps<typeof Feather>["name"];
type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];
type MaterialDesignIconName = ComponentProps<typeof MaterialDesignIcons>["name"];
type FontAwesomeFreeSolidIconName = ComponentProps<typeof FontAwesomeFreeSolid>["name"];

type IconConfig =
  | {
      family: "feather";
      name: FeatherIconName;
    }
  | {
      family: "material";
      name: MaterialIconName;
    }
  | {
      family: "material-design";
      name: MaterialDesignIconName;
    }
  | {
      family: "font-awesome";
      name: FontAwesomeFreeSolidIconName;
    };

const ICONS = {
  edit: { family: "feather", name: "edit" },
  calendar: { family: "material", name: "calendar-month" },
  chat: { family: "material-design", name: "chat" },
  home: { family: "material", name: "home" },
  notifications: { family: "material", name: "notifications" },
  person: { family: "material", name: "person" },
  "chevron-left": { family: "feather", name: "chevron-left" },
  "chevron-right": { family: "feather", name: "chevron-right" },
  "chevron-down": { family: "feather", name: "chevron-down" },
  circle: { family: "feather", name: "circle" },
  check: { family: "feather", name: "check" },
  close: { family: "material-design", name: "window-close" },
  ellipsis: { family: "font-awesome", name: "ellipsis" },
  list: { family: "material", name: "format-list-bulleted" },
  photo: { family: "material", name: "photo" },
  plus: { family: "feather", name: "plus" },
  trash: { family: "feather", name: "trash-2" },
  settings: { family: "feather", name: "settings" },
  search: { family: "feather", name: "search" },
  "square-r": { family: "material-design", name: "square-rounded" },
  "square-ro": { family: "material-design", name: "square-rounded-outline" },

  // Filled icons
  "check-circle": { family: "material-design", name: "check-circle" },
  "close-circle": { family: "material-design", name: "close-circle" },
  "plus-circle-filled": { family: "material-design", name: "plus-circle" },

  // SF Symbols aliases used by existing screens.
  "bell.fill": { family: "material", name: "notifications" },
  "cart.fill": { family: "material", name: "shopping-cart" },
  "checkmark.circle.fill": { family: "material-design", name: "check-circle" },
  "chevron.down": { family: "feather", name: "chevron-down" },
  "chevron.left": { family: "feather", name: "chevron-left" },
  "chevron.right": { family: "feather", name: "chevron-right" },
  "gearshape.fill": { family: "feather", name: "settings" },
  "house.fill": { family: "material", name: "home" },
  "list.bullet": { family: "material", name: "format-list-bulleted" },
  "message.fill": { family: "material-design", name: "chat" },
  "moon.fill": { family: "material", name: "dark-mode" },
  "person.fill": { family: "material", name: "person" },
  "photo.on.rectangle": { family: "material", name: "photo-library" },
  "plus.circle.fill": { family: "material-design", name: "plus-circle" },
  "sun.max.fill": { family: "material", name: "light-mode" },
  xmark: { family: "material-design", name: "window-close" },
} satisfies Record<string, IconConfig>;

type IconSymbolName = keyof typeof ICONS;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const icon = ICONS[name];

  const typedIcon = icon as IconConfig | undefined;

  if (typedIcon?.family === "feather") {
    return <Feather name={typedIcon.name} size={size} color={color} style={style} />;
  }

  if (typedIcon?.family === "material-design") {
    return <MaterialDesignIcons name={typedIcon.name} size={size} color={color} style={style} />;
  }

  if (typedIcon?.family === "material") {
    return <MaterialIcons name={typedIcon.name} size={size} color={color} style={style} />;
  }

  if (typedIcon?.family === "font-awesome") {
    return <FontAwesomeFreeSolid name={typedIcon.name} size={size} color={color} style={style} />;
  }

  return null;
}
