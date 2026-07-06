# Spec: Integrasi Food Delivery (GrabFood, GoFood, ShopeeFood)

## Objective
Membangun fondasi arsitektur "Two-Way Sync" untuk integrasi pengiriman makanan. Karena Kula POS memiliki platform Web dan *Mobile App*, seluruh logika integrasi **wajib** dipusatkan di *Supabase Edge Functions*. Web dan Mobile App hanya akan bertindak sebagai *client* yang mendengarkan perubahan database secara *real-time*.

Mengingat status Kula POS belum terdaftar sebagai Partner ISV resmi di Grab/Gojek, pengembangan akan dibagi menjadi tahapan logis. Fase ini fokus pada pembangunan **infrastruktur internal Kula POS** (Database, UI Pengaturan, UI Harga Produk, dan *skeleton* Edge Functions).

## Tahapan Pengembangan (Roadmap)
1. **Fase 1 (Kita kerjakan sekarang)**: Menyiapkan skema database `store_integrations`, merombak form produk untuk harga spesifik platform, dan membuat struktur *Supabase Edge Function* untuk menerima *webhook*.
2. **Fase 2 (Tugas Bisnis Anda)**: Anda/Tim Kula POS mendaftar ke GrabFood/GoFood Developer Portal sebagai *System Integrator (ISV)*.
3. **Fase 3 (Setelah API Key didapat)**: Menyambungkan *credentials* produksi ke dalam *Edge Functions* yang sudah kita bangun di Fase 1.

## Database Changes (Supabase)
Kita perlu menambahkan skema baru untuk melacak kredensial integrasi dan harga per platform:

1. **Tabel Baru: `store_integrations`**
   - Kolom: `id`, `store_id`, `platform` (ENUM: 'grab', 'gojek', 'shopee'), `merchant_id`, `access_token`, `refresh_token`, `status`, `sync_settings` (JSONB).
   - RLS Policy: Hanya dapat diakses oleh Owner/Superadmin dari toko terkait.

2. **Tabel Baru: `product_platform_prices`**
   - Kolom: `id`, `product_id`, `store_id`, `platform`, `platform_product_id` (ID produk di Grab/Gojek), `price` (Harga khusus platform), `is_active_on_platform` (boolean).
   - RLS Policy: Owner & Staff dari toko terkait.

## Arsitektur Mobile App & Web (Data Flow)
Karena Anda memiliki **Mobile App**, kita akan menggunakan pola arsitektur **Backend-Driven Synchronization**:

1. **Sinkronisasi Katalog (Kula → Platform)**
   - Kasir Web / Mobile App mengupdate harga "GoFood" di profil produk.
   - Perubahan tersimpan di tabel `product_platform_prices`.
   - *Supabase Database Webhook* mendeteksi perubahan ini dan otomatis memanggil Edge Function `sync-platform-catalog`.
   - Edge Function (server) meneruskan update ke API GoFood/GrabFood. (Tidak ada logic API pihak ke-3 di dalam *source code* Web/Mobile Kula).

2. **Sinkronisasi Pesanan (Platform → Kula)**
   - Ada pesanan masuk dari GrabFood.
   - GrabFood memanggil Endpoint kita: `https://[PROJECT_ID].supabase.co/functions/v1/food-delivery-webhook`.
   - Edge Function memvalidasi data dan langsung melakukan `INSERT` ke tabel `transactions` dengan tipe order `grabfood`.
   - **Keajaiban Realtime**: Karena Web Kula POS dan Mobile App Kula POS sudah men-*subscribe* tabel `transactions` menggunakan `Supabase Realtime`, order baru akan otomatis muncul (*pop-up*) di layar kasir (Web & Mobile) secara bersamaan!

## UI Changes (Web)
1. **Halaman Baru: Pengaturan Integrasi (`/settings/integrations`)**
   - Dashboard pengelolaan koneksi ke GrabFood, GoFood, dan ShopeeFood.
2. **Komponen yang Dimodifikasi: `ProductForm.jsx`**
   - Tab "Harga Platform" (Platform Pricing).
   - Kasir bisa mendefinisikan harga yang berbeda (contoh: Harga Dine-in Rp18.000, Harga GrabFood Rp24.000).

## User Review Required
> [!IMPORTANT]
> **Keputusan Eksekusi Fase 1**
> Dengan arsitektur ini, **Mobile App Anda aman** karena sama sekali tidak perlu diubah secara drastis, cukup membaca status transaksi seperti biasa dari database.
> 
> Karena pendaftaran ISV memakan waktu berminggu-minggu, apakah Anda setuju jika kita mulai **Mengeksekusi Fase 1** sekarang?
> Yang akan saya bangun:
> 1. Modifikasi tabel database (Migration).
> 2. Menambahkan UI "Harga Platform" di `ProductForm.jsx` (Web).
> 3. Membuat halaman "Pengaturan Integrasi" di (Web).
> 4. Membuat *skeleton code* (kerangka kerja) Supabase Edge Function `food-delivery-webhook` yang nantinya siap Anda isi dengan kode *production* saat API Key rilis.
