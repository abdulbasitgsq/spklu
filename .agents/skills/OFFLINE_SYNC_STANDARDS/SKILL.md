---
name: OFFLINE_SYNC_STANDARDS
description: Pedoman penanganan data offline, sinkronisasi ke Supabase, dan penggunaan IndexedDB/localStorage di KULA POS.
---

# Sinkronisasi & Mode Offline

Aplikasi POS harus tetap bisa bertransaksi meskipun koneksi internet terganggu.

## 1. Penyimpanan Lokal
- Gunakan `offlineService` untuk menyimpan transaksi yang gagal dikirim karena masalah jaringan.
- Data master (produk, kategori) harus di-cache di lokal (misal menggunakan `DataContext` atau storage lokal) agar bisa diakses saat offline.

## 2. Safe Query Wrapper
Selalu gunakan wrapper yang mendukung kegagalan jaringan saat melakukan operasi krusial (seperti simpan transaksi).
- Gunakan utilitas seperti `safeSupabaseQuery` yang sudah menyediakan logika retry atau fallback offline.

## 3. Mekanisme Sinkronisasi
- Transaksi yang tersimpan di antrean offline harus otomatis disinkronkan saat koneksi kembali pulih (online event listener).
- Pastikan tidak ada duplikasi data saat sinkronisasi (gunakan idempotency key atau UUID yang konsisten dari sisi client).

## 4. Indikator Status
- Berikan indikator visual kepada pengguna jika aplikasi sedang dalam mode offline.
- Tampilkan jumlah data yang belum tersinkronkan.

## 5. Prioritas Data
- Transaksi penjualan memiliki prioritas tertinggi untuk disinkronkan.
- Perubahan pengaturan atau data master dapat disinkronkan setelah data transaksi aman.
