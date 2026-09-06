import { SvgXml } from "react-native-svg";

import { BOX_ICON_PATHS } from "@/shared/components/boxicon-paths";
import { useCurrentTheme } from "@/shared/hooks/use-current-theme";

export type IconName = keyof typeof BOX_ICON_PATHS;
export type IconPack = "basic" | "filled";
export type IconWeightName = "thin" | "normal";
export type IconWeight = IconWeightName | 200 | 400;

export type IconProps = {
  name: IconName;
  size?: number;
  fill?: string;
  opacity?: number | string;
  pack?: IconPack;
  weight?: IconWeight;
  removePadding?: boolean;
};

const WEIGHT_NAMES: Record<IconWeight, IconWeightName> = {
  200: "thin",
  400: "normal",
  thin: "thin",
  normal: "normal",
};

const VIEW_BOXES: Record<IconWeightName, string> = {
  thin: "3 3 18 18",
  normal: "2 2 20 20",
};

const DEFAULT_VIEW_BOX = "0 0 24 24";

export function Icon({
  name,
  size = 20,
  fill,
  opacity,
  pack = "basic",
  weight = "thin",
  removePadding = true,
}: IconProps) {
  const { colors } = useCurrentTheme();
  const resolvedFill = fill ?? colors.icon.primary;
  const resolvedWeight = WEIGHT_NAMES[weight];
  const iconPaths = BOX_ICON_PATHS[name] as Partial<
    Record<IconPack, Partial<Record<IconWeightName, string>>>
  >;
  const pathMarkup = iconPaths[pack]?.[resolvedWeight];

  if (!pathMarkup) {
    throw new Error(`Boxicon "${name}" does not provide ${pack}/${resolvedWeight}`);
  }

  const xml = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${DEFAULT_VIEW_BOX}" fill="currentColor">${pathMarkup}</svg>`;

  return (
    <SvgXml
      xml={xml}
      width={size}
      height={size}
      color={resolvedFill}
      fill={resolvedFill}
      opacity={opacity}
      viewBox={removePadding ? VIEW_BOXES[resolvedWeight] : DEFAULT_VIEW_BOX}
    />
  );
}
