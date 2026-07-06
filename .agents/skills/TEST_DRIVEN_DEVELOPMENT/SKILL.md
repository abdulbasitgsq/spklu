# TEST_DRIVEN_DEVELOPMENT — KULA POS (Superpowers)

## Deskripsi
Metodologi RED-GREEN-REFACTOR untuk memastikan setiap baris kode memiliki tujuan dan teruji.

## Siklus Pengembangan

### 1. RED (Gagal)
- Tulis sebuah tes untuk fitur atau perbaikan kecil yang diinginkan.
- Jalankan tes tersebut dan pastikan ia **GAGAL**. Ini membuktikan tes tersebut valid.

### 2. GREEN (Lulus)
- Tulis kode seminimal mungkin hanya untuk membuat tes tersebut lulus.
- Jangan pedulikan keindahan kode di tahap ini, yang penting fungsionalitas benar.
- Jalankan tes kembali dan pastikan **LULUS**.

### 3. REFACTOR (Rapikan)
- Bersihkan dan rapikan kode yang baru ditulis (naming, DRY, simplifikasi).
- Pastikan tes tetap **LULUS** setelah dirapikan.

## Aturan Emas
- Dilarang menulis kode produksi sebelum ada tes yang gagal.
- Hapus semua kode yang ditulis tapi tidak memiliki tes yang mengujinya (YAGNI).
- Setiap bug fix dimulai dengan sebuah tes yang mendeteksi bug tersebut.
