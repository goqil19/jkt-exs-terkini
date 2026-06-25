// CONFIGURATION
// Ganti dengan URL dan Anon Key dari dashboard Supabase Anda
const SUPABASE_URL = 'https://xpzebprkmnridfoyuswx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwemVicHJrbW5yaWRmb3l1c3d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNDg1ODgsImV4cCI6MjA5NzkyNDU4OH0.gFlLtIdOrRP9XiySVtEg0yKJMi1EnLvX-y5IyTnNoMA';

// Inisialisasi Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
