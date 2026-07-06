---
name: DATABASE_AND_RLS_STANDARDS
description: Pedoman pengelolaan database Supabase, Row Level Security (RLS), dan penanganan multi-tenancy yang aman di KULA POS.
---

# Database & Keamanan Supabase (RLS)

Aplikasi KULA POS adalah sistem multi-tenant. Setiap operasi database harus memastikan isolasi data antar toko/tenant.

## 1. Row Level Security (RLS)
Setiap tabel baru di Supabase **WAJIB** memiliki kebijakan RLS.
- **Isolasi Data**: Pastikan kebijakan RLS membatasi akses berdasarkan `store_id` (atau relasi yang mengarah ke `store_id`).
- **Policy Template**:
  ```sql
  -- Contoh policy untuk select
  CREATE POLICY "Users can view their own store data" ON "public"."transactions"
  FOR SELECT USING (auth.uid() IN (
    SELECT profile_id FROM profiles WHERE store_id = transactions.store_id
  ));
  ```

## 2. Multi-tenancy di Sisi Client
Saat melakukan query dari frontend:
- **Wajib Filter store_id**: Gunakan `.eq('store_id', activeStoreId)` pada setiap query `select`, `update`, dan `delete`.
- **Jangan Percaya Client Side**: Walaupun filter dilakukan di client, RLS di database adalah pertahanan terakhir.

## 3. Remote Procedure Calls (RPC)
Gunakan RPC untuk operasi kompleks yang melibatkan banyak tabel atau perhitungan agregasi berat untuk menjaga integritas data dan performa.
- Pastikan RPC memeriksa otorisasi pengguna di dalam fungsi SQL-nya.

## 5. Pencegahan "Efek Domino" & Integritas Data
Seringkali perubahan di satu fitur merusak data di fitur lain (misal: Transaksi jadi 0 atau hilang).
- **Regression Guard**: Sebelum melakukan perubahan pada skema database atau fungsi agregasi, jalankan `npm run test` untuk memastikan fitur lain tidak terimbas.
- **Atomic Transactions**: Gunakan RPC (PostgreSQL functions) untuk operasi yang melibatkan stok dan uang. Jangan melakukan update stok dan simpan transaksi secara terpisah di sisi client (mencegah data "menggantung").
- **Zero Value Protection**: Selalu gunakan `COALESCE(column_name, 0)` di SQL atau pengecekan `val || 0` di JavaScript untuk mencegah hasil perhitungan menjadi `NaN` atau `0` karena ada data yang `null`.
- **Audit Log**: Untuk tabel krusial seperti stok dan keuangan, pastikan setiap perubahan memiliki record di tabel riwayat/log.

## 6. Standar Pelaporan Keuangan & Dashboard
<<<<<<< HEAD
=======
**REFERENSI WAJIB**: `sql/migrations/20260516_standardize_transactions_reporting.sql`

>>>>>>> 44c01f5 (chore: release v0.41.0 - standardize financial reporting with master migration baseline)
Untuk mencegah regresi di mana data Dashboard menjadi kosong atau salah perhitungan:
- **Kontrak Data Dashboard**: Fungsi `get_dashboard_stats` **WAJIB** mengembalikan objek JSONB lengkap dengan field: `totalSales`, `totalTransactions`, `totalNetProfit`, `totalGrossProfit`, `otherIncome`, `expenses`, `categoryData`, `topProducts`, `recentTransactions`, dan `chartData`. Jangan pernah menghapus field ini tanpa sinkronisasi frontend.
- **Formula Laba Bersih**: Laba Bersih = Revenue - Shipping - COGS - Expenses. Pendapatan Lain (Other Income) **TIDAK** dimasukkan dalam perhitungan Laba Bersih utama demi akurasi audit.
- **Blacklist Status Standard**: Gunakan filter status transaksi tipe *Blacklist* (`void`, `cancelled`, `refunded`, dll) di seluruh fungsi pelaporan untuk menjamin konsistensi angka.
- **Robust JSONB Extraction**: Selalu gunakan `public.safe_cast_numeric` saat mengambil data angka dari kolom JSONB `items` untuk mencegah error casting dan hasil `0` akibat data malformed.
- **Regression Guard**: Setiap perubahan pada RPC finansial wajib merujuk pada `sql/REPORTING_STANDARDS.md`.
