# Theme Cleanup Notes

## General Instructions

- Use UK English spelling in commit messages, documentation, comments, and user-facing copy.

Date: 2026-06-07

This is a reference note from the theme cleanup discussion. It describes the current direction and the known follow-up. It is not a final architecture document.

## Starting Point

- The app had a `ThemePreferenceProvider` in `lib/context/ThemePreferenceProvider.tsx`.
- That provider stored the effective app colour scheme and a `toggleTheme` function.
- React Native's system theme hook was imported as `useColorScheme as useSystemColorScheme`.
- The project also had `hooks/use-color-scheme.ts` and `hooks/use-color-scheme.web.ts`, but both only re-exported the provider's `useColorScheme`.
- `hooks/use-theme.ts` used `useColorScheme`, merged `Colors[scheme]` with `Accent`, and wrapped the returned theme object in `useMemo`.
- `hooks/use-theme-color.ts` was an older Expo-style helper and was still imported by `components/parallax-scroll-view.tsx`.
- Components were split between two approaches: some used `useTheme()`, others read `Colors[colorScheme]` directly.
- `Colors.light` and `Colors.dark` did not have the same shape. For example, dark dashboard tile colours were objects, while light dashboard tile colours were strings.
- `ThemedText` had moved to a `variant` prop, but several screens still passed the old `type` prop.

## Changes Made

- Removed the old alias hooks:
  - `hooks/use-color-scheme.ts`
  - `hooks/use-color-scheme.web.ts`
- Removed the old Expo helper:
  - `hooks/use-theme-color.ts`
- Removed the old theme hook:
  - `hooks/use-theme.ts`
- Added `lib/context/ThemeModeProvider.tsx`.
- Added `hooks/use-current-theme.ts`.
- Updated the root layout to import `ThemePreferenceProvider` from `@/lib/context/ThemeModeProvider`.
- Updated several styling consumers to import from `@/hooks/use-current-theme` instead of `@/hooks/use-theme`.
- Removed the commented-out old purple `Accent` block from `constants/theme.ts`.
- Changed `Colors.light` so it now broadly matches the `Colors.dark` shape, including accent tokens, `errorText`, `borderStrong`, `tabIconSelected`, and object-shaped `homeTileColors`.
- Updated some `ThemedText` usage from `type` to `variant`, including the You screen and Select Group modal.
- Changed the You screen avatar from `colors.tint` to `colors.accent`.
- There are also unrelated auth/token naming changes in the working tree:
  - `initializeToken` was renamed to `initialiseToken`.
  - `SessionProvider` was updated to call `initialiseToken`.

## Current Intended Model

- The provider owns theme mode state.
- React Native's `useColorScheme` should mean the system/device setting only.
- `useThemePreference()` should return the current effective app mode and the toggle function.
- `useCurrentTheme()` should return styling tokens for the current mode.
- UI components should generally use `useCurrentTheme()` for styling.
- Components should only use `useThemePreference()` when they need the mode itself or need to toggle it.
- Direct `Colors[colorScheme]` usage should be phased out in components.

## Remaining Follow-up

- `Colors.light` currently appears to contain dark-mode values. Decide later whether that is temporary or intentional.

## Suggested Next Pass

1. Review the intended light-mode palette.
2. Keep new styling consumers on `useCurrentTheme()` instead of direct `Colors[colorScheme]` access.
3. Run `npx tsc --noEmit` before committing theme changes.
