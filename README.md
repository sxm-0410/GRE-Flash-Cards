# 🦅 GREedy Words

**The Ultimate Vocabulary Mastery Platform for GRE Candidates.**

GREedy Words is a specialized vocabulary learning platform designed to make GRE preparation structured, interactive, and effective. By combining cognitive science principles like active recall and spaced repetition with a modern, high-fidelity user interface, we help students master the 1,000+ essential words needed for a top-tier Verbal score.

**[View the Live Prototype](https://gre-vocabulary-flash-cards-fd1clvzuv.vercel.app)**

---

## The Core Philosophy

Our learning model is built on three essential pillars:

1.  **Daily Discipline** — A fixed daily challenge of 20 words to build habit and ensure long-term retention.
2.  **Self-Directed Learning** — Curated word lists (High-Frequency 500, Barron's 333) for students to explore at their own pace.
3.  **Active Recall** — Interactive MCQ assessments that force the brain to retrieve definitions rather than passively recognize them.

---

## ✨ Phase 1 Features (Live)

The current prototype demonstrates the core learning loop designed for our B2B B2B pilot:

-   **Interactive MCQ Daily Challenge:** A 20-word session with multiple-choice questions. Answering reveals the word details and flips the card for full review.
-   **3D Flashcard Interface:** Tactile, flipping cards showing part of speech, definitions, usage examples, synonyms, and antonyms.
-   **Dynamic Dashboard:** Real-time tracking of streaks, mastered words, and XP progress.
-   **Word List Browser:** Dual-view system allowing students to switch between focused **Flashcard Mode** and a comprehensive **Grid View**.
-   **Smooth Transitions:** High-quality slide and flip animations for a professional "app-like" feel.

---

## ⚙️ Environment Variables (Local Setup)

Before running the application locally, you must connect it to a Supabase database.

1. Create a new project on [Supabase](https://supabase.com/).
2. Run the SQL scripts found in `supabase_schema.sql` and `seed_data.sql` in your Supabase SQL Editor.
3. In your Supabase dashboard, go to **Authentication > Providers > Email** and turn **OFF** "Confirm email" (for testing purposes).
4. Go to **Project Settings > API** to find your keys.
5. Create a `.env` file in the root directory of this project and add your credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🛠️ Tech Stack

Built with a modern, high-performance stack optimized for both web and future mobile expansion:

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite + TypeScript) |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Routing** | React Router |
| **Hosting** | Vercel |

---

## 🗺️ Roadmap

### Phase 2: Personalization & Persistence
- User Registration & Authentication (Supabase/Firebase).
- Persistent Backend (PostgreSQL) for user-word state tracking.
- Advanced Spaced Repetition (SM-2 Algorithm).
- Instructor/Admin Dashboard for training centers.

### Phase 3: Mobile & Gamification
- React Native app for iOS & Android.
- Push notification reminders.
- Badge system and leaderboard.

---

## 🛠️ Local Development

To run the project locally:

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/sxm-0410/GRE-Flash-Cards.git
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```

---

_Project managed and developed by [Sampath Bageyawadi](https://github.com/sxm-0410)._
