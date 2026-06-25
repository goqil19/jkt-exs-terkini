# Agregator Berita Sederhana

Website agregator berita satu halaman (single page) dengan panel admin, menggunakan HTML/CSS/JS murni dan Supabase. Siap dihosting langsung di GitHub Pages.

## Fitur
- **Pengunjung:**
  - Tampilan grid responsif (Mobile, Tablet, Desktop)
  - Card berita yang langsung membuka link sumber di tab baru
  - Pencarian berita berdasarkan judul
  - Tampilan modern, minimalis, dan cepat
- **Admin:**
  - Login menggunakan Supabase Auth
  - Panel admin untuk Create, Read, Update, Delete (CRUD) berita
- **SEO & Performa:**
  - Meta tags, Open Graph, Sitemap, dan Robots.txt
  - Tanpa framework (Vanilla JS) agar sangat ringan

## Prasyarat
1. Akun [Supabase](https://supabase.com)
2. Akun [GitHub](https://github.com)

## Instalasi & Konfigurasi Supabase

### 1. Buat Project Supabase
1. Login ke Supabase dan buat project baru.
2. Tunggu hingga database selesai disiapkan.

### 2. Jalankan Script SQL
1. Di dashboard Supabase, buka menu **SQL Editor**.
2. Buat query baru, lalu copy-paste seluruh isi file `supabase.sql` dari repository ini.
3. Klik **Run**. Script ini akan:
   - Membuat tabel `news_links`
   - Mengaktifkan Row Level Security (RLS)
   - Membuat kebijakan agar publik bisa membaca data, tapi hanya user login (admin) yang bisa menambah/mengedit/menghapus data.

### 3. Setup Authentication (Admin Login)
1. Buka menu **Authentication** > **Providers** di Supabase.
2. Pastikan **Email** provider diaktifkan.
3. Matikan fitur *Confirm email* jika tidak ingin repot verifikasi (opsional, untuk kemudahan testing).
4. Buka menu **Authentication** > **Users**.
5. Klik **Add User** > **Create new user**.
6. Masukkan email dan password untuk akun Admin Anda.

### 4. Konfigurasi App (Supabase URL & Anon Key)
1. Buka menu **Project Settings** (ikon gerigi) > **API**.
2. Salin `Project URL` dan `anon` `public` key.
3. Buka file `js/supabase.js` di komputer Anda.
4. Ganti placeholder dengan URL dan Key milik Anda:
   ```javascript
   const SUPABASE_URL = 'https://xxxxxx.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJh...';
   ```

## Deployment ke GitHub Pages

1. Buat repository baru di GitHub.
2. Upload semua file (termasuk folder `css` dan `js`) ke repository tersebut.
3. Di repository GitHub Anda, buka **Settings** > **Pages**.
4. Di bagian **Build and deployment**, pilih **Source**: `Deploy from a branch`.
5. Pilih branch `main` (atau `master`) dan folder `/ (root)`.
6. Klik **Save**.
7. Tunggu beberapa menit, website Anda akan live di `https://username.github.io/nama-repo/`.

## Struktur File
- `/index.html`: Halaman utama pengunjung
- `/admin.html`: Halaman login dan panel admin
- `/css/style.css`: File styling
- `/js/supabase.js`: Inisialisasi koneksi Supabase
- `/js/app.js`: Logika untuk halaman utama (fetch data, search)
- `/js/admin.js`: Logika untuk auth dan CRUD panel admin
- `/supabase.sql`: Script SQL untuk setup database
- `/sitemap.xml` & `/robots.txt`: Konfigurasi SEO

## Keamanan
Aplikasi ini aman karena:
1. Menggunakan RLS (Row Level Security) dari Supabase.
2. Operasi mutasi data (Insert, Update, Delete) hanya diizinkan untuk pengguna yang sudah diautentikasi.
3. `anon key` yang terekspos di `supabase.js` aman digunakan di sisi client (browser) selama RLS di Supabase sudah dikonfigurasi dengan benar melalui script SQL yang disediakan.
