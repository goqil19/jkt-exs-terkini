-- Hapus tabel jika sudah ada (opsional)
-- DROP TABLE IF EXISTS news_links;

-- Buat tabel
CREATE TABLE news_links (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT,
    source TEXT,
    news_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE news_links ENABLE ROW LEVEL SECURITY;

-- Kebijakan (Policy) 1: Siapapun dapat membaca (SELECT) data
-- "Allow public read access"
CREATE POLICY "Allow public read access" 
ON news_links
FOR SELECT 
USING (true);

-- Kebijakan (Policy) 2: Hanya user yang terautentikasi (admin yang login) yang dapat INSERT
CREATE POLICY "Allow authenticated users to insert" 
ON news_links
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Kebijakan (Policy) 3: Hanya user yang terautentikasi (admin yang login) yang dapat UPDATE
CREATE POLICY "Allow authenticated users to update" 
ON news_links
FOR UPDATE
TO authenticated 
USING (true)
WITH CHECK (true);

-- Kebijakan (Policy) 4: Hanya user yang terautentikasi (admin yang login) yang dapat DELETE
CREATE POLICY "Allow authenticated users to delete" 
ON news_links
FOR DELETE
TO authenticated 
USING (true);
