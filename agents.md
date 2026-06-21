# Agent Notes

## General

- Use UK English spelling in commit messages, documentation, comments, and user-facing copy.
- Keep changes scoped to the requested behaviour and preserve unrelated user work.
- This directory is its own Git repository. The sibling `server` directory is separate, so check and commit each repository independently.

## Client Structure

- The app is an Expo Router React Native app. Routes live under `app/`.
- Reusable UI lives under `components/`; shared context lives under `lib/context/`.
- API wrappers live under `services/`; lower-level request helpers live under `utils/`.
- Use the `@/` path alias for local imports when matching existing code.

## Theme

- `ThemePreferenceProvider` in `lib/context/ThemeModeProvider.tsx` owns the persisted user preference and falls back to the system colour scheme.
- Use `useCurrentTheme()` for styling tokens.
- Use `useThemePreference()` only when a component needs the current mode or needs to toggle it.
- Keep `Colors.light` and `Colors.dark` structurally identical in `constants/theme.ts`. If one palette gains or loses a token, update the other at the same time.
- Avoid new direct `Colors[colorScheme]` lookups in components unless there is a clear reason.

## Auth Tokens

- `services/tokenManager.ts` is the access point for auth token storage.
- `getToken()` and `getRefreshToken()` read from `expo-secure-store` and are async, so callers must `await` them.
- Save token pairs with `saveTokens()` and clear auth state with `clearTokens()`.
- Do not add new direct token reads from `SecureStore` outside the token manager.

## Validation

- Run `npx tsc --noEmit` for TypeScript changes.
- Run `npm run lint` for routing, UI, and styling changes.

## Recent Changes

- Added group dashboard count endpoints on the server and wired the client dashboard to fetch live list, calendar, album, and message counts with typed list query helpers.
