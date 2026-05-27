# Changelog

All notable changes to the **GRE Vocabulary Flash Cards** project will be documented in this file.

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
