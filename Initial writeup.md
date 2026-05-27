**Document Type:** Product Feature Specification & Workflow Reference  
**Audience:** Developer, Stakeholders, Training Center Partners  
**Status:** Phase 2 MVP Live (Deployed on Vercel with Supabase Backend)

---

## Table of Contents

1. Product Overview
2. Target Audience & Go-To-Market Strategy
3. Monetization Model
4. User Roles
5. Feature Specification — Student Side
6. Feature Specification — Teacher / Admin Dashboard
7. Spaced Repetition Logic
8. Backend Architecture & Data Flow
9. Tech Stack (Updated)
10. Phase 1 Prototype Scope & Status
11. Post-MVP Roadmap

---

## 1. Product Overview

GREedy Words is a web-based vocabulary learning platform built specifically for GRE preparation. It combines structured daily learning habits with self-paced exploration, using flashcard mechanics, spaced repetition, and quiz-based assessment to maximize word retention.

The platform is designed to serve two delivery models: institutional (licensed to GRE training centers) and direct-to-consumer (sold to individual students). Both models share the same core product; what differs is the access layer and analytics visibility.

The core learning philosophy is built on three pillars:

- **Daily discipline** — A fixed daily challenge of 20 words builds habit and long-term retention through repeated exposure.
- **Self-directed learning** — Curated word lists allow students to explore and master vocabulary at their own pace, beyond the daily challenge.
- **Active recall** — Quiz modes force students to retrieve words from memory rather than passively recognize them, which produces stronger learning outcomes.

---

## 2. Target Audience & Go-To-Market Strategy

**Primary (B2B — Phase 1):** GRE training centers and coaching institutes. The platform is licensed to centers as a supplementary learning tool for their enrolled students. The value proposition to training centers is twofold: a structured vocabulary tool for students, and a progress reporting dashboard for instructors.

**Secondary (B2C — Phase 2):** Individual students preparing for the GRE independently. If the B2B channel does not convert, the product is pushed to the public as a direct subscription service.

**Phase 1 — B2B Pilot:**  
Approach training centers with a working prototype demonstrating the student UI and a wireframe of the teacher dashboard. The goal is a Letter of Intent or a paid pilot agreement covering a cohort of students. A teacher dashboard showing engagement metrics and vocabulary mastery per student is the primary differentiator in this conversation.

**Phase 2 IF PHASE 1 DOESN'T WORK OUT — B2C Public Launch:**  
If B2B does not produce results within a defined window, launch publicly with a free tier and a paid premium tier priced accessibly for Indian students.

---

## 3. Monetization Model

The platform operates on a two-tier subscription model. There are no additional plans, bundles, or add-ons — the structure is intentionally simple.

|Tier|Price|Access|
|---|---|---|
|Free|Rs. 0|2 word lists unlocked, quizzes limited to those 2 lists, daily challenge access|
|Premium|Rs. 180 / month|All word lists, all quiz modes, full daily challenge, complete progress tracking|

**Notes on the Free Tier:**  
The free tier is designed to give users enough access to experience the product genuinely, not just a preview. Two word lists with associated quizzes and the daily challenge is a meaningful slice of the product. The intent is to let the product sell itself through usage rather than forcing an early paywall.

**Notes on B2B Pricing:**  
For training centers, pricing is negotiated as a per-student or per-cohort license, separate from the public subscription model. The center pays a flat institutional fee; their students receive premium-equivalent access during the license period.

---

## 4. User Roles

The platform has three distinct user roles, each with different access and capabilities.

**Student (End User)**  
The primary user of the platform. Interacts with flashcards, daily challenges, word lists, and quizzes. Has a personal dashboard tracking their progress, streaks, and word mastery states.

**Instructor / Center Admin (B2B Only)**  
Attached to a training center account. Cannot interact with learning content directly. Has read-only access to a dashboard showing aggregated and individual student performance data for their enrolled cohort.

**Platform Admin (Internal)**  
Manages the word database, word lists, user accounts, and subscription states. Not customer-facing.

---

## 5. Feature Specification — Student Side

### 5.1 Authentication & Onboarding

- Students register with email and password, or via Google OAuth.
- On first login, a brief onboarding flow asks: target GRE date, current vocabulary comfort level (beginner / intermediate / advanced), and daily time available. This data informs the initial daily challenge difficulty seeding but does not restrict access.
- B2B students may be enrolled by their training center admin via batch email invitation, bypassing public registration.

---

### 5.2 Daily Challenge

The daily challenge is the core habit-forming feature of the platform. Each day, a set of 20 words is presented to the student as an interactive MCQ-based assessment.

**Flow:**

1. Student opens the app and sees the Daily Challenge card on the home screen with a prompt to begin.
2. Words are presented one at a time in a specialized flashcard format with 3 definition options below.
3. Each flashcard shows: the word and its part of speech.
4. The student selects the correct definition from the 3 options provided.
5. **Immediate Feedback:** Selecting an answer reveals if it was correct or incorrect, and automatically flips the card to reveal the full definition, example sentence, synonyms, and antonyms.
6. **Navigation:** Students can use "Previous" and "Next" buttons to cycle through all words in the current session for review.
7. After all 20 words, a session summary is shown: correct answers, incorrect answers, and XP earned.
8. Incorrectly answered words are flagged for earlier re-appearance based on spaced repetition rules.

**Repeat Schedule:**  
Words cycle back into the daily challenge based on how the student performed. This ensures that difficult words are seen more frequently and mastered through repetition.

**Streak System:**  
Completing the daily challenge increments the student's streak counter. Missing a day resets the streak to zero. The streak is prominently displayed on the home dashboard to encourage consistency.

**Access by Tier:**  
Both free and premium users have access to the daily challenge. The word pool for free users is drawn from the two unlocked word lists only.

---

### 5.3 Word Lists (Self-Paced Learning)

Word lists allow students to learn vocabulary outside the daily challenge, at their own pace, in structured groups.

**List Structure:**  
Each list has a name, a difficulty tag (Foundational / Intermediate / Advanced), a total word count, and a mastery percentage that updates as the student learns words from it.

**Available Lists (Examples):**

- GRE High-Frequency 500
- Barron's Essential 333
- Difficult Antonyms & Synonyms
- Commonly Confused Words
- Advanced Academic Vocabulary

Free tier users have 2 lists unlocked. All remaining lists are visible but locked, with a prompt to upgrade.

**Note:** Lists could be curated for said business.

**Inside a Word List:**  
Students can browse all words in a list. The interface supports two viewing modes:
- **Flashcard View:** A focused view for flipping cards and studying details with smooth slide transitions.
- **Grid View:** A bird's-eye view of all words in the list for quick reference.

Tapping a word or flipping a card opens the detailed word view containing: definition, part of speech, usage examples, synonyms, and antonyms. Students can browse at their own pace using the navigation arrows.

**Learning Mode within a List:**  
Students can launch a flashcard session from any list. This is unstructured — there is no daily limit. Progress through the list is tracked visually via mastery bars.

---

### 5.4 Quiz Mode

Quizzes test active recall rather than passive recognition. There are three quiz formats.

**Multiple Choice (MCQ)**  
A word is displayed. The student selects the correct definition from 4 options. Incorrect options are plausible near-synonyms to increase difficulty.

**Fill in the Blank**  
A sentence with a missing word is displayed. The student selects the correct word from 4 options. Tests contextual understanding.

**Synonym / Antonym Match**  
A word is shown with a prompt ("Find the antonym of..."). The student picks from 4 options.

**Quiz Session Flow:**

1. Student selects a quiz type and a word list to quiz from.
2. A session of 10 or 20 questions is generated (student selects length).
3. Immediate feedback shown after each answer — correct/incorrect, with the correct definition displayed.
4. End-of-session summary shows: score, accuracy percentage, words answered incorrectly (with correct answers), and XP earned.
5. Incorrectly answered words are automatically flagged and added to a "Needs Review" pool.

**Access by Tier:**  
Free users can quiz on their 2 unlocked lists only. Premium users have access to all lists across all quiz formats.

---

### 5.5 Personal Word Bank

A student-managed collection of bookmarked words from any list or flashcard session.

- Students can bookmark words from the word detail view, during flashcard sessions, or from quiz results.
- The word bank is organized by date added and searchable by word.
- Students can launch a flashcard session or quiz specifically from their word bank.
- Words mastered from the word bank update their mastery state globally.

---

### 5.6 Progress Dashboard

A personal dashboard summarizing the student's learning history and current standing.

**Displayed Metrics:**

- Current streak and longest streak
- Total words seen, familiar, and mastered
- Daily challenge completion history (calendar heatmap view)
- Quiz accuracy over time (line graph)
- Mastery breakdown per word list
- XP total and badge collection

**Word Mastery States:**  
Every word in the system has a state per student:

|State|Meaning|
|---|---|
|Unseen|Not yet encountered|
|Seen|Shown at least once in a flashcard|
|Familiar|Marked "I know this" at least once|
|Learned|Answered correctly in a quiz at least once|
|Mastered|Answered correctly in a quiz 3 times across different sessions|

---

### 5.7 Gamification

Light gamification is used to encourage consistency without trivializing the learning goal.

- **Streak Counter** — Daily challenge completions build a streak. Displayed prominently on the home screen.
- **XP System** — XP is earned for completing daily challenges, finishing quiz sessions, and mastering words.
- **Badges** — Milestone badges awarded for: 7-day streak, 30-day streak, 100 words mastered, 200 words mastered, 500 words mastered, first quiz perfect score, completing a full word list.
- **Word Mastery Progress Bars** — Visual progress bars per list give a tangible sense of advancement.

---

## 6. Feature Specification — Teacher / Admin Dashboard

The teacher dashboard is a read-only analytics interface available exclusively in the B2B deployment. It is accessible to instructors and training center admins.

### 6.1 Cohort Overview

- Total students enrolled
- Number of students active in the last 7 days
- Average daily challenge completion rate across the cohort
- Average quiz accuracy across the cohort

### 6.2 Individual Student View

- Per-student breakdown: streak, words mastered, quiz accuracy, last active date
- Word mastery state distribution per student (how many words at each mastery level)
- Daily challenge completion history
- Quiz session history with scores

### 6.3 Weak Words Report

- Words with the highest incorrect answer rate across the cohort
- Useful for instructors to identify vocabulary that needs classroom reinforcement

### 6.4 Engagement Report

- Daily active users over a selected date range
- Challenge completion trend over time
- Identifies students who have been inactive for 3+ days (at-risk flagging)

### 6.5 Student Enrollment

- Admin can invite students via CSV upload (bulk email invitation) or individual email
- Admin can remove students from the cohort
- Admin can view which students are on active access and which have lapsed

---

## 7. Spaced Repetition Logic

The platform uses a simplified spaced repetition model suited to the GRE preparation timeline (typically 2–6 months). A full SM-2 implementation is not used in the initial version; instead, a rule-based scheduling system is applied.

|Student Action|Next Appearance in Daily Challenge|
|---|---|
|Marked "I know this"|After 7 days|
|Marked "I don't know this"|After 4 days|
|Skipped (session closed mid-way)|After 2 days|
|Manually marked as "Hard"|Every day until correct 3 consecutive times|
|Answered incorrectly in a quiz|Added to Needs Review pool; appears in next daily challenge|
|Mastered (quiz correct 3x)|Removed from active rotation; can still be accessed via lists|

Words in a student's Needs Review pool take priority in the daily challenge queue. If the pool exceeds 20 words, the daily challenge is drawn entirely from Needs Review until the pool is cleared.

---

## 8. Backend Architecture & Data Flow

### 8.1 Core Entities

**Users**  
Stores authentication credentials, role, subscription tier, enrollment status (if B2B), and onboarding metadata.

**Words**  
The master word database. Each record contains: word, definition, part of speech, etymology, example sentences (2–3), synonyms, antonyms, difficulty rating, and list associations.

**Word Lists**  
Named collections of words with metadata: name, difficulty tag, word count, and tier access requirement (free or premium).

**User Word State**  
A per-user, per-word record tracking: mastery state, times seen, times correct in quiz, times incorrect in quiz, last seen date, next scheduled appearance date, and any manual flags (bookmarked, marked hard).

**Quiz Sessions**  
Records each quiz session: user, word list used, quiz type, questions asked, answers given, score, and timestamp.

**Daily Challenge Sessions**  
Records each daily challenge completion: user, date, words presented, responses (know / don't know), and completion status.

**Streaks**  
Tracks current streak, longest streak, and last challenge completion date per user.

**Organizations (B2B)**  
Training center accounts with associated admin users, enrolled student lists, and license expiry date.

---

### 8.2 Key Backend Flows

**Daily Challenge Generation**  
When a student requests their daily challenge, the backend:

1. Queries the student's User Word State table for words scheduled for today or overdue.
2. Fills remaining slots (up to 20) with new unseen words from the student's accessible lists, prioritized by list order and difficulty.
3. Returns the 20-word set to the client.
4. On session completion, updates each word's state based on the student's responses and calculates the next appearance date.

**Quiz Generation**  
When a student starts a quiz:

1. Backend selects N words from the chosen list (N = 10 or 20).
2. For each word, generates 3 distractor options from words of similar difficulty within the same list.
3. Returns the full question set to the client.
4. On completion, quiz session is recorded and incorrect words are flagged in User Word State.

**Subscription & Access Control**  
Every request for word list content or quiz generation passes through an access check:

1. Retrieve the user's current subscription tier.
2. Check if the requested resource (list or quiz) is permitted under that tier.
3. Return content or a 403 with an upgrade prompt. For B2B users, access is controlled by the organization's license expiry date instead of a personal subscription.

**Progress Sync**  
After every flashcard session and quiz session, the backend updates:

- User Word State for each word touched
- Daily Challenge Session record
- Streak counter
- XP total
- Badge eligibility check (trigger badge award if threshold met)

**Teacher Dashboard Data**  
Dashboard queries are aggregated reads from User Word State, Daily Challenge Sessions, and Quiz Sessions, filtered by organization. These are computed on request (not pre-aggregated in the initial version) and cached with a short TTL to reduce database load.

---

### 8.3 Authentication Flow

1. User submits credentials (email/password or OAuth token).
2. Backend validates and issues a JWT access token (short-lived, 15 minutes) and a refresh token (long-lived, 30 days).
3. All subsequent API requests include the access token in the Authorization header.
4. On access token expiry, the client uses the refresh token to obtain a new access token silently.
5. Logout invalidates the refresh token server-side.

B2B batch-enrolled students receive an email invitation with a one-time setup link. On clicking, they set a password and are automatically associated with their organization.

---

## 9. Tech Stack (Updated)

|Layer|Technology|Rationale|
|---|---|---|
|Web Frontend|React (Vite + TypeScript)|High performance, type safety, and fast development cycle.|
|Backend & Auth|Supabase (PostgreSQL)|Provides instant Auth, Row Level Security, and a scalable relational database.|
|Styling|Tailwind CSS v4|Modern utility-first styling with native CSS variable support.|
|Animations|Framer Motion|Smooth 3D flips and slide transitions for a tactile feel.|
|Icons|Lucide React|Consistent and high-quality iconography.|
|Routing|React Router|Robust navigation for student and admin flows.|
|Hosting|Vercel|Instant deployments and production-grade performance.|
|Mobile (Phase 3)|React Native|Planned shared logic and components with web frontend.|

---

## 10. Phase 2 MVP Scope & Status

The Phase 2 MVP is now live, completing the transition from a static prototype to a fully data-driven application using Supabase.

**Completed in Phase 2:**

- **Backend Integration:** Replaced static mock data with a live Supabase PostgreSQL database.
- **Authentication:** Implemented secure user registration and login flows with email validation and strict password requirements.
- **Protected Routing:** Established secure access control, redirecting guests to the landing/auth pages.
- **Dynamic Dashboard:** Live tracking of user streaks, XP, active lists, and word mastery progress directly from the database.
- **Strict Daily Challenge Logic:** Implemented backend session tracking to enforce a strict "once-per-day" completion limit for the 20-word challenge, automatically updating the user's streak upon completion.
- **Expanded Content:** Seeded the database with 72 distinct, high-quality GRE words categorized into three curated lists (High-Frequency 500, Barron's Essential 333, Advanced GRE Vocabulary).
- **Public Vocabulary Access:** Configured Row Level Security (RLS) policies to allow guests to browse vocabulary lists as a marketing/teaser tool.

**Remaining for B2B Readiness:**

- Teacher dashboard UI implementation (Read-only analytics).
- B2B batch enrollment logic (CSV upload / organization linking).
- Full Spaced Repetition scheduling algorithm (moving beyond session tracking to calculate `next_appearance_date`).

---

## 11. Post-MVP Roadmap

**Phase 3 — B2C Public Launch**

- Payment gateway integration (Razorpay for Indian market)
- Public-facing pricing page
- Additional quiz modes (fill in the blank, synonym/antonym match)
- Personal word bank
- Badge and XP system fully implemented
- Email notifications for streak reminders

**Phase 4 — Mobile**

- React Native app for iOS and Android
- Push notifications for daily challenge
- Home screen widget — word of the day
- Offline flashcard mode (cached word sets)

**Phase 5 — Intelligence Layer**

- Upgrade spaced repetition to SM-2 algorithm based on accumulated user performance data
- Adaptive daily challenge difficulty based on individual mastery velocity
- Weak area detection — automatically recommends which list to focus on next

---

_Document last updated: May 27, 2026_