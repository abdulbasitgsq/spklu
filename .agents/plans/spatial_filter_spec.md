# Spec: Filter Wilayah (Provinsi & Kabupaten/Kota)

## Objective
Menyediakan mekanisme filtering berbasis wilayah (Provinsi dan Kota/Kabupaten) secara bertingkat untuk menyaring 4.707 stasiun pengisian daya EV. Hal ini membatasi jumlah data yang dikomputasi dan dirender di frontend, sehingga aplikasi berjalan sangat lancar dan ringan.

## Business Types
- Tipe bisnis: General / EV Charging Locator.

## Database Changes
- Tidak ada.

## UI Changes
- **Filter Bar (`src/components/FilterBar.jsx` & `src/index.css`)**:
  - Menambahkan dua dropdown HTML `<select>` di sebelah kiri filter kategori.
  - Dropdown 1: "Pilih Provinsi" (Jawa Barat, Banten, Bali, dll.).
  - Dropdown 2: "Pilih Kabupaten/Kota" (terbuka jika Provinsi dipilih).
  - Bergaya modern: background putih, font Inter, border bulat tipis, padding proporsional.

## Data Flow
- `App.jsx` mengompilasi daftar unik Provinsi secara nasional, dan Kota/Kabupaten berdasarkan Provinsi terpilih.
- `selectedProvinsi` dan `selectedKabupaten` mengontrol filter pada array `chargersData`.
- Hasil saringan dikirim ke `ChargerList` (menampilkan 50 stasiun teratas) dan `ChargerMap` (merender 200 marker teratas).

## Success Criteria
- [ ] Dropdown Provinsi memuat daftar unik provinsi secara alfabetis dari dataset.
- [ ] Memilih Provinsi menyaring data peta dan list secara seketika, serta memicu dropdown Kota/Kabupaten.
- [ ] Memilih "Semua Provinsi" (kosong) mereset filter Kota/Kabupaten dan menampilkan seluruh data nasional.
- [ ] Penggunaan filter regional menurunkan beban rendering sehingga rendering list dan peta berjalan instan.
