ALTER TABLE public.profile
  ADD COLUMN IF NOT EXISTS who_focus text NOT NULL DEFAULT 'Learning coding & technology through AI',
  ADD COLUMN IF NOT EXISTS who_personality text NOT NULL DEFAULT 'Calm learner, curious thinker, future-focused dreamer',
  ADD COLUMN IF NOT EXISTS who_favourite_book text NOT NULL DEFAULT 'Al-Qur''an',
  ADD COLUMN IF NOT EXISTS who_interests text[] NOT NULL DEFAULT ARRAY['Reading books','Writing poetry','Self-development'];