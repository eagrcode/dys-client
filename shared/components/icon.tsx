import {
  SquareIcon,
  CheckSquareIcon,
  CheckIcon,
  CheckCircleIcon,
  SelectionIcon,
  CircleIcon,
  CircleDashedIcon,
  CaretRightIcon,
  CaretLeftIcon,
  CaretUpIcon,
  CaretDownIcon,
  ListBulletsIcon,
  CalendarDotsIcon,
  ImagesIcon,
  ChatTextIcon,
  DotsThreeIcon,
  XIcon,
  ArrowRightIcon,
  BellIcon,
  PencilSimpleIcon,
  TrashIcon,
  PlusIcon,
  PlusCircleIcon,
  ListChecksIcon,
  ShoppingCartIcon,
  HouseIcon,
  UsersThreeIcon,
  UserIcon,
  MoonIcon,
  SunIcon,
} from "phosphor-react-native";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  weight?: IconWeight;
};

export type IconName =
  | "square"
  | "square-check"
  | "check"
  | "check-circle"
  | "selection"
  | "circle"
  | "circle-dashed"
  | "caret-right"
  | "caret-left"
  | "caret-up"
  | "caret-down"
  | "list-bullets"
  | "calendar-dots"
  | "images"
  | "chat-text"
  | "dots-three"
  | "x"
  | "arrow-right"
  | "bell"
  | "pencil-simple"
  | "trash"
  | "plus"
  | "plus-circle"
  | "list-checks"
  | "shopping-cart"
  | "house"
  | "users"
  | "user"
  | "moon"
  | "sun";

export type IconWeight = "thin" | "light" | "regular" | "bold" | "fill";

export function Icon({
  name,
  size = 20,
  color,
  weight = "regular",
}: IconProps) {
  const { colors } = useCurrentTheme();
  color = color ?? colors.icon;

  switch (name) {
    case "square":
      return <SquareIcon size={27} color={color} weight="regular" />;
    case "square-check":
      return <CheckSquareIcon size={27} color={color} weight="regular" />;
    case "check":
      return <CheckIcon size={size} color={color} weight={weight} />;
    case "check-circle":
      return <CheckCircleIcon size={size} color={color} weight={weight} />;
    case "selection":
      return <SelectionIcon size={size} color={color} weight={weight} />;
    case "circle":
      return <CircleIcon size={size} color={color} weight={weight} />;
    case "circle-dashed":
      return <CircleDashedIcon size={size} color={color} weight={weight} />;
    case "caret-right":
      return <CaretRightIcon size={size} color={color} weight={weight} />;
    case "caret-left":
      return <CaretLeftIcon size={size} color={color} weight={weight} />;
    case "caret-up":
      return <CaretUpIcon size={size} color={color} weight={weight} />;
    case "caret-down":
      return <CaretDownIcon size={size} color={color} weight={weight} />;
    case "list-bullets":
      return <ListBulletsIcon size={30} color={color} weight={weight} />;
    case "calendar-dots":
      return <CalendarDotsIcon size={size} color={color} weight={weight} />;
    case "images":
      return <ImagesIcon size={size} color={color} weight={weight} />;
    case "chat-text":
      return <ChatTextIcon size={size} color={color} weight={weight} />;
    case "dots-three":
      return <DotsThreeIcon size={size} color={color} weight={weight} />;
    case "x":
      return <XIcon size={size} color={color} weight={weight} />;
    case "arrow-right":
      return <ArrowRightIcon size={size} color={color} weight={weight} />;
    case "bell":
      return <BellIcon size={size} color={color} weight={weight} />;
    case "pencil-simple":
      return <PencilSimpleIcon size={size} color={color} weight={weight} />;
    case "trash":
      return <TrashIcon size={size} color={color} weight={weight} />;
    case "plus":
      return <PlusIcon size={size} color={color} weight={weight} />;
    case "plus-circle":
      return <PlusCircleIcon size={size} color={color} weight={weight} />;
    case "list-checks":
      return <ListChecksIcon size={30} color={color} weight={weight} />;
    case "shopping-cart":
      return <ShoppingCartIcon size={30} color={color} weight={weight} />;
    case "house":
      return <HouseIcon size={size} color={color} weight={weight} />;
    case "users":
      return <UsersThreeIcon size={size} color={color} weight={weight} />;
    case "user":
      return <UserIcon size={size} color={color} weight={weight} />;
    case "moon":
      return <MoonIcon size={size} color={color} weight={weight} />;
    case "sun":
      return <SunIcon size={size} color={color} weight={weight} />;
    default:
      return null;
  }
}
