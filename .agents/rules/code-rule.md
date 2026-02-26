---
trigger: always_on
---

# Antigravity Rules

## Tech Stack
- **Framework**: Next.js
- **Styling**: Tailwind CSS with Neobrutalism design (Bold borders, vibrant colors, hard shadow offsets)

## Server Interaction (API & Hooks)
- **Folder**: All server-side data fetching or mutations should be abstracted into custom hooks located in the `src/hooks` folder.
- **Library**: Use the **SWR** (Stale-While-Revalidate) library for data fetching, caching, and state management.
- **Implementation**: Prefer structured fetchers and mutation handlers within the hooks.

## UI/UX Standards (Interactions)
- **Button Feedback**: Every button interaction must handle the following:
  1. **Disabled State**: The button must be disabled while an operation is in progress (`isLoading` or `isMutating`).
  2. **Loading Feedback**: Show a loading indicator (e.g., `Loader2` spinner) while the operation is pending.
  3. **Toast Notifications**: Always trigger a toast notification (using `sonner`) to inform the user of the success or failure of an action.

## Neobrutalism Design Tokens (Tailwind)
- **Borders**: `border-[3px] border-black`
- **Shadows**: `shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]` or `shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`
- **Colors**: Use high-contrast Neobrutalist colors (e.g., bright yellows, teals, pinks).
- **Typography**: Bold/Black font weights for headings, often uppercase.

## Components: 
- always use shadcn modified to neo brutalism