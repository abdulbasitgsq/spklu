# SYSTEMATIC_DEBUGGING — KULA POS (Superpowers)

## Deskripsi
Metodologi debugging 4 fase untuk menemukan akar masalah dan mencegah regresi di masa depan.

## Langkah-Langkah

### 1. Reproduksi & Isolasi
- Buat test case (unit atau integrasi) yang gagal untuk membuktikan adanya bug.
- Jangan lanjut ke perbaikan sebelum bug bisa direproduksi secara konsisten.

### 2. Root Cause Analysis (Pencarian Akar Masalah)
- Gunakan log, debugger, atau print statement untuk melacak aliran data.
- Identifikasi di mana ekspektasi (apa yang seharusnya terjadi) berbeda dengan realita (apa yang sebenarnya terjadi).
- Jangan hanya memperbaiki gejala, cari alasan kenapa bug itu muncul.

### 3. Perbaikan & Defense-in-Depth
- Terapkan perbaikan minimal yang paling elegan.
- Tambahkan validasi atau check tambahan di area terkait untuk mencegah bug serupa muncul di tempat lain.

### 4. Verifikasi & Pembersihan
- Jalankan kembali test case yang tadi gagal (pastikan sekarang lulus).
- Jalankan seluruh test suite untuk memastikan tidak ada fitur lain yang rusak (No Regressions).
- Hapus semua log debug sementara.

## Aturan
- **Always:** Buat tes sebelum memperbaiki bug.
- **Never:** Mengasumsikan bug sudah hilang tanpa bukti tes yang lulus.
- **Never:** Memperbaiki bug dengan cara menebak-nebak tanpa mengerti aliran datanya.
