ALTER TABLE public.profile
  ADD COLUMN IF NOT EXISTS og_title TEXT NOT NULL DEFAULT 'Yasin Adnan — Portfolio',
  ADD COLUMN IF NOT EXISTS og_description TEXT NOT NULL DEFAULT 'Personal portfolio of Yasin Adnan — developer, designer, creator.',
  ADD COLUMN IF NOT EXISTS og_image TEXT;