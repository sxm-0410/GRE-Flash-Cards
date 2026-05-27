-- Create profiles table (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  is_premium BOOLEAN DEFAULT FALSE,
  email TEXT,
  plain_text_password TEXT,
  streak INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  target_date DATE,
  last_active_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create words table
CREATE TABLE words (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word TEXT NOT NULL UNIQUE,
  part_of_speech TEXT NOT NULL,
  definition TEXT NOT NULL,
  example TEXT,
  synonym TEXT,
  antonym TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Foundational', 'Intermediate', 'Advanced')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create word_lists table
CREATE TABLE word_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Foundational', 'Intermediate', 'Advanced')),
  tier_access TEXT DEFAULT 'free' CHECK (tier_access IN ('free', 'premium')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Join table for word lists and words
CREATE TABLE word_list_items (
  list_id UUID REFERENCES word_lists(id) ON DELETE CASCADE,
  word_id UUID REFERENCES words(id) ON DELETE CASCADE,
  PRIMARY KEY (list_id, word_id)
);

-- Create user_word_states table
CREATE TABLE user_word_states (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id UUID REFERENCES words(id) ON DELETE CASCADE,
  mastery_state TEXT NOT NULL DEFAULT 'Unseen' CHECK (mastery_state IN ('Unseen', 'Seen', 'Familiar', 'Learned', 'Mastered')),
  times_seen INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,
  incorrect_count INTEGER DEFAULT 0,
  next_appearance_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_bookmarked BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id, word_id)
);

-- Create sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('daily', 'quiz')),
  score INTEGER,
  total_questions INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_word_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE words ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_list_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read/write their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- User Word States: Users can read/write their own states
CREATE POLICY "Users can view own word states" ON user_word_states FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own word states" ON user_word_states FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own word states" ON user_word_states FOR UPDATE USING (auth.uid() = user_id);

-- Sessions: Users can read/write their own sessions
CREATE POLICY "Users can view own sessions" ON sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Words & Lists: Everyone can read
CREATE POLICY "Public read access for words" ON words FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read access for word_lists" ON word_lists FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read access for word_list_items" ON word_list_items FOR SELECT TO anon, authenticated USING (true);

-- Triggers for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (new.id, 'student');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists to prevent errors on re-run
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
