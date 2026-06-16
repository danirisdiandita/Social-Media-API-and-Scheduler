# User Posting Restriction — Implementation Plan

## Context
When `creatorInfo.error.code` matches one of the TikTok API error codes from `todos/tiktok_api_error_reference.html`, we need to:
1. Show the user-facing message from the reference as a toaster
2. Show a matching warning banner on the connection card in the UI
3. Disable the posting button

Part of this already exists in `src/app/(dashboard)/posts/video/page.tsx` — the `SPAM_RISK_CODES` check disables the button and shows a red "Posting Disabled" block, but it only covers 3 of the 7 error codes and uses the raw `error.message` instead of the curated user-facing text from the HTML reference.

---

## Step 1: Expand `SPAM_RISK_CODES` → rename to `POSTING_RESTRICTION_CODES` with message mappings

**File:** `src/hooks/useCreatorInfo.ts`

Replace the current flat array:

```ts
export const SPAM_RISK_CODES = [
    'spam_risk_too_many_posts',
    'spam_risk_user_banned_from_posting',
    'reached_active_user_cap'
];
```

With a lookup map that includes all 7 error categories from the HTML reference, mapping each error code to its severity and user-facing message (title + subtitle):

```ts
export interface RestrictionInfo {
  code: string;
  title: string;
  subtitle: string;
  severity: 'warning' | 'error' | 'retry';
}

export const POSTING_RESTRICTION_CODES: Record<string, RestrictionInfo> = {
  spam_risk_too_many_posts: {
    code: 'spam_risk_too_many_posts',
    title: "You've reached today's posting limit",
    subtitle: 'You can post again tomorrow. Check back in 24 hours.',
    severity: 'warning',
  },
  spam_risk_user_banned_from_posting: {
    code: 'spam_risk_user_banned_from_posting',
    title: "Your account can't post right now",
    subtitle: 'TikTok has restricted posting on your account. Contact TikTok support for help.',
    severity: 'error',
  },
  reached_active_user_cap: {
    code: 'reached_active_user_cap',
    title: 'Service is busy — try again later',
    subtitle: "We've hit our daily publishing limit. Please try posting again in a few hours.",
    severity: 'warning',
  },
  access_token_invalid: {
    code: 'access_token_invalid',
    title: 'Your TikTok session has expired',
    subtitle: 'Please reconnect your TikTok account to continue posting.',
    severity: 'error',
  },
  scope_not_authorized: {
    code: 'scope_not_authorized',
    title: 'Posting permission not granted',
    subtitle: 'Please reconnect your TikTok account and allow posting access when prompted.',
    severity: 'error',
  },
  rate_limit_exceeded: {
    code: 'rate_limit_exceeded',
    title: 'Too many requests — slow down',
    subtitle: "You're sending requests too quickly. Wait a moment and try again.",
    severity: 'warning',
  },
  tiktok_server_error: {
    code: 'tiktok_server_error',   // placeholder key for 5xx / unknown server errors
    title: 'TikTok is having issues right now',
    subtitle: "This is on TikTok's end, not yours. Please try again in a few minutes.",
    severity: 'retry',
  },
};

// Keep backward compatibility — extract just the code strings
export const SPAM_RISK_CODES = Object.keys(POSTING_RESTRICTION_CODES);
```

Also add a helper function:

```ts
export function getRestrictionInfo(errorCode: string | undefined): RestrictionInfo | null {
  if (!errorCode) return null;
  // Also handle 5xx generic case — if the status code was 5xx and code is empty/'—'
  return POSTING_RESTRICTION_CODES[errorCode] || null;
}
```

---

## Step 2: Fire a toast on `creatorInfo` success when error code is a restriction

**File:** `src/hooks/useCreatorInfo.ts`

In the `onSuccess` callback, replace the current generic `toast.warning(data.error.message)` with the curated message from the lookup map:

```ts
onSuccess: (data) => {
  const errorCode = data?.error?.code;
  const restriction = getRestrictionInfo(errorCode);

  if (restriction) {
    // Show user-facing toast with the curated title + subtitle
    toast.warning(restriction.title, {
      description: restriction.subtitle,
      position: 'top-center',
      duration: 8000,
    });
  } else if (errorCode === 'ok' || !errorCode) {
    toast.success("Please choose Privacy level of your platform's post", {
      position: 'top-center',
    });
  }
},
```

This ensures the toast fires immediately when a user selects a connection and the info comes back with an error code.

---

## Step 3: Update the "Posting Disabled" warning block in the connection card

**File:** `src/app/(dashboard)/posts/video/page.tsx` (lines ~715–754)

Currently:
```tsx
const isBlocked = error && SPAM_RISK_CODES.includes(error.code);
// ...
{isBlocked && (
  <div className="p-2 border-2 border-black bg-red-500 text-white font-black text-[10px] uppercase leading-tight">
    Posting Disabled: {error.message}
  </div>
)}
```

Change to:
```tsx
const restriction = getRestrictionInfo(error?.code);
const isBlocked = !!restriction;
// ...
{isBlocked && restriction && (
  <div className="p-2 border-2 border-black bg-red-500 text-white font-black text-[10px] uppercase leading-tight space-y-1">
    <p>Posting Disabled: {restriction.title}</p>
    <p className="font-medium normal-case text-[9px] opacity-90">{restriction.subtitle}</p>
  </div>
)}
```

The import line (currently line 43) would change from:
```ts
import { useCreatorInfo, SPAM_RISK_CODES } from "@/hooks/useCreatorInfo";
```
to:
```ts
import { useCreatorInfo, SPAM_RISK_CODES, getRestrictionInfo } from "@/hooks/useCreatorInfo";
```

---

## Step 4: Keep the posting button disabled (already works)

**File:** `src/app/(dashboard)/posts/video/page.tsx` (lines ~1390–1395)

The button disable logic already checks:
```ts
const isSpam = error && SPAM_RISK_CODES.includes(error.code);
```

This still works because `SPAM_RISK_CODES` will be the set of all restriction keys. No change needed here — it's just a code-coverage expansion by updating the array source.

---

## Step 5: Apply the same changes to the photos page

**File:** `src/app/(dashboard)/posts/photos/page.tsx`

The photos page uses the same `SPAM_RISK_CODES` import and pattern. Update its import and the "Posting Disabled" rendering block identically to Step 3.

---

## What changes and what stays

| What | Change |
|------|--------|
| `useCreatorInfo.ts` | Replace flat `SPAM_RISK_CODES` array with a lookup map of error code → user-facing title/subtitle/severity. Add `getRestrictionInfo()` helper. |
| `useCreatorInfo.ts` — `onSuccess` | Replace generic `toast.warning(data.error.message)` with curated toast using `restriction.title` + `restriction.subtitle` description. |
| `page.tsx` (video) | Import `getRestrictionInfo`. Replace inline `Posting Disabled: {error.message}` with curated `restriction.title` + `restriction.subtitle`. |
| `page.tsx` (photos) | Same as video page. |
| Button disable | No logic change — the existing `SPAM_RISK_CODES.includes(error.code)` check still works because `SPAM_RISK_CODES` is rebuilt from the lookup map keys. |

---

## Error code coverage (from `tiktok_api_error_reference.html`)

| Original code/key | Title (user-facing msg) | Already covered? |
|---|---|---|
| `spam_risk_too_many_posts` | "You've reached today's posting limit" | Yes |
| `spam_risk_user_banned_from_posting` | "Your account can't post right now" | Yes |
| `reached_active_user_cap` | "Service is busy — try again later" | Yes |
| `access_token_invalid` | "Your TikTok session has expired" | **No** (being added) |
| `scope_not_authorized` | "Posting permission not granted" | **No** (being added) |
| `rate_limit_exceeded` | "Too many requests — slow down" | **No** (being added) |
| 5xx / server errors | "TikTok is having issues right now" | **No** (being added as `tiktok_server_error`) |

---

## Step 6: Simulation / debug toggle for testing all error states

To test the UI without actually triggering real API errors, add a debug simulation block at the top of the component.

### 6a — Simulation variables (top of component, near other state)

**File:** `src/app/(dashboard)/posts/video/page.tsx` (around line 82, near `const [previewUrl, ...]`)

```ts
// ── Debug simulation ──────────────────────────────────────────
const isSimulatingError = true;
const simulatedErrorCode:
  | 'spam_risk_too_many_posts'
  | 'spam_risk_user_banned_from_posting'
  | 'reached_active_user_cap'
  | 'access_token_invalid'
  | 'scope_not_authorized'
  | 'rate_limit_exceeded'
  | 'tiktok_server_error'
  | null = 'spam_risk_user_banned_from_posting';
// ───────────────────────────────────────────────────────────────
```

- `isSimulatingError` — set to `false` in production, `true` to force the simulation.
- `simulatedErrorCode` — pick one of the 7 keys (or `null` to disable). The union type ensures typos are impossible.

### 6b — Inject the simulated error into `connectionDetails`

After fetching the real `creatorInfo` in `toggleConnection` (lines ~203–206), merge in the simulated error **only when `isSimulatingError` is true**:

```ts
const info = await getCreatorInfo({ connectionId: id });
if (info) {
  if (isSimulatingError && simulatedErrorCode) {
    const restriction = getRestrictionInfo(simulatedErrorCode);
    info.error = {
      code: simulatedErrorCode,
      message: restriction?.title || simulatedErrorCode,
    };
  }
  setConnectionDetails((prev) => ({ ...prev, [id]: info }));
}
```

This means:
- The `connectionDetails[id].error.code` will be the simulated code
- The `isBlocked` check, toast, and button disable all react to it
- The actual `creatorInfo.data` (privacy options, duration, etc.) is still real — only the error is faked

### 6c — Also fire the toast on simulation

Since the `useCreatorInfo` hook's `onSuccess` already fires a toast when the response has a restriction code, but we're mutating the data *after* it's returned, we should explicitly fire a toast in the simulation branch too:

```ts
if (isSimulatingError && simulatedErrorCode) {
  const restriction = getRestrictionInfo(simulatedErrorCode);
  if (restriction) {
    toast.warning(restriction.title, {
      description: `${restriction.subtitle}`,
      position: 'top-center',
      duration: 8000,
    });
  }
}
```

The `[SIMULATED]` prefix makes it obvious this isn't a real error during development.

### 6d — Apply same simulation to photos page

**File:** `src/app/(dashboard)/posts/photos/page.tsx`

Same 3 blocks (variables, injection in `toggleConnection`, toast) — identical pattern.

### Simulation usage workflow

1. Set `isSimulatingError = true`, pick a code like `'access_token_invalid'`.
2. Open the video/photos post page.
3. Click a TikTok connection.
4. Observe:
   - Toast fires with the curated title + subtitle (prefixed `[SIMULATED]`).
   - Connection card shows red "Posting Disabled" block with the curated message.
   - Posting button is disabled (with the tooltip explaining why).
   - All other connection content (privacy dropdown, interaction toggles) are disabled via the existing `isBlocked` prop.
5. Change `simulatedErrorCode` to another code and repeat.
6. Set `isSimulatingError = false` before committing/deploying.
