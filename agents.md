# Agent Notes

## General

- Use UK English spelling in commit messages, documentation, comments, and user-facing copy.
- Keep changes scoped to the requested behaviour and preserve unrelated user work.
- This directory is its own Git repository. The sibling `server` directory is separate, so check and commit each repository independently.
- When pushing commits, use the SSH remote form, for example `git@github.com:eagrcode/dys-client.git`, instead of HTTPS.

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

## Lists Feature Todo

- Add edit-list support from the list detail screen, including title and list type changes.
- Add edit-item support for existing list items, including inline or modal editing and empty-value handling.
- Move list deletion into the individual list screen so destructive list actions live with the list they affect.
- Add item deletion from the list detail screen with confirmation or an undo-friendly interaction.
- Add clear loading, pending, and error states for create, edit, toggle, and delete list item mutations.
- Centralise list type labels, icons, and display order so list overview, list detail, and create/edit flows use the same source.
- Tighten list query keys and cache updates so group list summaries and list detail views stay in sync after edits and deletes.
- Add empty states for lists with no items and groups with no lists, with a direct create action where appropriate.
- Add validation for list and item titles, including trimming whitespace and preventing blank submissions.
- Check Android/web icon mappings for all list icons used by `IconSymbol`.

## Recent Changes

- Added group dashboard count endpoints on the server and wired the client dashboard to fetch live list, calendar, album, and message counts with typed list query helpers.
