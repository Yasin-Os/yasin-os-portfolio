-- Add accent color setting
ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS accent_h integer NOT NULL DEFAULT 244,
  ADD COLUMN IF NOT EXISTS accent_s integer NOT NULL DEFAULT 75,
  ADD COLUMN IF NOT EXISTS accent_l integer NOT NULL DEFAULT 60;

-- Public media bucket for admin uploads (photos, video, audio, apk, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Public read for media bucket
DROP POLICY IF EXISTS "media public read" ON storage.objects;
CREATE POLICY "media public read"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

-- Admin write to media bucket
DROP POLICY IF EXISTS "media admin insert" ON storage.objects;
CREATE POLICY "media admin insert"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'media'
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "media admin update" ON storage.objects;
CREATE POLICY "media admin update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'media'
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "media admin delete" ON storage.objects;
CREATE POLICY "media admin delete"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'media'
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);