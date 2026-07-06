# CORE_LOGIC_SAFETY — KULA POS

## Deskripsi
Pedoman ketat untuk melindungi integritas alur transaksi, perhitungan keuangan, dan database inti KULA POS agar tidak berubah tanpa instruksi eksplisit.

## Aturan Utama

### 1. Perlindungan Alur Transaksi (Immutability)
- **DILARANG** mengubah logika di dalam `POS.jsx`, `DataContext.jsx` (fungsi `saveOrder`, `processSale`), dan RPC `process_sale` tanpa perintah khusus.
- Perubahan pada alur transaksi **WAJIB** melalui workflow `@/spec`.

### 2. Akurasi Perhitungan Keuangan
- Seluruh fungsi agregasi (Shift Summary, Profit & Loss, Cash Flow) harus memiliki rumus yang sinkron satu sama lain.
- Jika satu laporan diubah (misal: penambahan filter status), maka laporan terkait lainnya **WAJIB** diaudit dan disinkronkan.

### 3. Keamanan Database Inti
- Perubahan pada tabel `transactions`, `shifts`, `stock_movements`, dan `cash_flow` harus dianggap sebagai **High-Risk Change**.
- Selalu gunakan `SECURITY DEFINER` dan `search_path = public` pada setiap RPC baru untuk mencegah celah keamanan.

### 4. Protokol Verifikasi (Regression)
- Setiap perubahan pada logika inti harus diikuti dengan pengetesan unit test:
  ```bash
  npm test src/context/DataContext.test.jsx
  npm test src/pages/reports/
  ```
- Hasil test harus **100% Passed** sebelum melakukan rilis.

## Batasan (Boundaries)
- **Always:** Minta konfirmasi sebelum mengubah nama kolom atau tipe data di tabel keuangan.
- **Always:** Dokumentasikan setiap perubahan logika perhitungan di `CHANGELOG.md`.
- **Never:** Melakukan "Silent Refactor" pada kode yang mengelola uang atau stok.
- **Never:** Mengasumsikan status transaksi (Selalu cek filter `status` yang digunakan di halaman laporan).

## Referensi File Kritis
- `src/context/DataContext.jsx` (Data persistence)
- `src/context/ShiftContext.jsx` (Shift closure logic)
- `sql/functions/get_shift_summary.sql` (Reporting source of truth)
- `sql/functions/process_sale.sql` (Transaction engine)
