# Changelog

All notable changes to the **GRE Vocabulary Flash Cards** project will be documented in this file.

## [2026-05-28] - Practice Mode, Advanced Auth, & Mastery Polish

### Added
- **Global Practice Mode (`/practice`)**: Introduced a new, unmetered practice tab allowing users to drill a specific word list or test themselves globally across the entire database. Practice sessions grant 5 XP per correct answer but do not affect the daily streak.
- **Spaced Repetition Mastery Algorithm**: 
  - Implemented the core state machine for word mastery in both Daily Challenge and Practice modes.
  - Words now progress through states: `Unseen` -> `Seen` (incorrect) -> `Familiar` (1 correct) -> `Learned` (2 correct on different days) -> `Mastered` (3 correct on different days).
- **Mastery UI Tooltip**: Added a clickable info icon (`ⓘ`) to the Dashboard's Mastery Progress section that explains the state machine rules to the user.
- **"View All" Recent Words Modal**: Clicking "View All" on the Dashboard now opens a scrollable, glassmorphism modal displaying the user's last 50 tested words, complete with definitions and current mastery states.
- **"Keep me signed in" Logic**: Added session persistence controls. If a user unchecks "Keep me signed in" during login, the application uses strict `sessionStorage` and forcefully clears the authentication state when the browser tab is closed.
- **Profile Personalization**: The sign-up form now captures `first_name` and `last_name`. The Dashboard greets the user by name if available.
- **Auto-Redirect System**: If an unauthenticated user attempts to visit a protected route (like `/dashboard`), the URL is captured (`?redirectTo=...`) and the user is seamlessly routed back to their intended destination after logging in.

### Changed
- **Mastery UI Redesign**: Replaced the initial concept of colored dot indicators with refined, ultra-compact text badges (`text-[9px]`, uppercase, wide tracking) that provide clear, immediate state feedback without relying on hover states.
- **Layout Robustness**: Applied CSS `hyphens: auto`, `break-words`, and strict column widths to the Word Lists Grid View and Recent Words blocks to ensure long vocabulary words (e.g., "Anachronistic") wrap cleanly without breaking the badge layout.
- **Recent Words Query**: Refactored the Dashboard "Recent Words" block to accurately fetch the user's actual testing history from `user_word_states`, rather than random words. It now also displays brief definition snippets inline.
- **Sign Out Flow**: Modified the `Layout` component's sign-out button to execute a hard window reload (`window.location.href = '/'`) to ensure all React state is wiped and the user is returned to the public Landing Page.

### Fixed
- **Word Lists Data Sync**: Updated the `useWords` hook on the Word Lists page to explicitly cross-reference the user's ID with the database, ensuring the Grid View accurately reflects the user's live mastery states rather than defaulting to `Unseen`.

## [2026-05-27] - Major Refactor & Supabase Integration

### Added
- **Supabase Backend Integration**: Transitioned from static mock data to a live PostgreSQL database hosted on Supabase.
- **Dedicated Auth Page (`/auth`)**: Implemented a responsive, full-screen authentication page featuring a 3D flip animation between Sign In and Sign Up states.
- **Landing Page (`/`)**: Added a marketing-focused landing page with a hero section, feature highlights, and clear calls to action.
- **Dynamic Stats Tracking**: Dashboard stats (Streak, Words Mastered, Total XP, Active Lists) are now live-linked to the user's `profiles` and `user_word_states` tables.
- **Daily Challenge Limits**: Implemented strict once-per-day completion logic. The rate limiting is tied to **UTC calendar days**, meaning the challenge resets globally at exactly 00:00 UTC (e.g., 5:30 AM IST). If a user completes a daily challenge, the Dashboard updates with a "Completed" badge, and the `/challenge` route actively blocks subsequent attempts for that UTC day with a blurred overlay.
- **Advanced Auth Validation**: Added real-time client-side password validation (Capital letter, Special Character, No Hyphens/Spaces, 6+ characters) and improved email typo detection (e.g., catching `@gma.com`).
- **Data Expansion**: Seeded the database with 72 distinct GRE words split evenly across three distinct lists (High-Frequency, Barron's 333, Advanced).
- **Glassmorphism Overlay**: Clicking a word in the Word Lists "Grid View" now opens a blurred, centered overlay displaying that word's interactive flashcard.
- **Sidebar UX**: Added a dynamic "Sign Out" button to the layout sidebar that appears only for authenticated users, and removed the placeholder "Admin" tab.

### Changed
- **Routing Architecture**: Restructured `App.tsx` to enforce protected routes. Guests visiting `/dashboard` or `/challenge` are now automatically redirected to `/auth`.
- **Word Lists View**: Unified the tier system (removed "Premium" tags for the MVP phase). The view now displays a clear selection menu of available lists before entering the practice UI.
- **UI Responsiveness**: Updated Flashcards and Auth modals to use `min-height` rather than fixed heights, preventing text overflow on smaller screens or when displaying lengthy definitions.

### Fixed
- **Blank Screen / TypeScript Errors**: Resolved initial strict type-checking issues (e.g., changing `import { WordList }` to `import type { WordList }`) that were blocking the build.
- **List Visibility Bug (Permission Denied)**: 
  - *Problem*: The `WordLists` page was rendering blank or throwing "permission denied" errors because Supabase blocks read access by default.
  - *Solution*: Wrote and executed explicit SQL `GRANT` statements and RLS (Row Level Security) policies to allow both `anon` and `authenticated` roles to read the `word_lists`, `words`, and `word_list_items` tables.
- **Auth Flow Loop (Email Confirmation)**:
  - *Problem*: Users were kicked back to the login screen immediately after signing up.
  - *Solution*: Identified that Supabase's "Confirm Email" setting was preventing session creation. Updated the frontend to handle session-less signups gracefully and advised disabling the setting in the Supabase dashboard for the testing phase.
- **Silent Failures on Challenge Completion**:
  - *Problem*: Completing the Daily Challenge did not update the streak or lock the user out, with no visible errors.
  - *Solution*: The `sessions` table lacked proper insert permissions. Added explicit error handling/alerts to the frontend `saveSession` function and generated the SQL required to grant `INSERT` permissions to the `authenticated` role.

---
*End of log for May 27, 2026*
