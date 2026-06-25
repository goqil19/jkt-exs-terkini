// CONFIGURATION
// Ganti dengan URL dan Anon Key dari dashboard Supabase Anda
const SUPABASE_URL = 'https://xpzebprkmnridfoyuswx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_ztFxruwCCQE_hlHNbBD-kQ_wyH-TGYB';

// Inisialisasi Supabase client
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
