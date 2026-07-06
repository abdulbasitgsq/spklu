# Spec: Perbaikan Peta & Tata Letak Kartu Samping

## Objective
Mengatasi bug visual render ubin peta Leaflet dengan mengimpor stylesheet bawaan Leaflet. Selain itu, menyesuaikan visual kartu stasiun EV di list samping agar muat sempurna tanpa overflow horizontal, membungkus judul maksimal 2 baris, serta menghapus tombol favorit (hati) dan badge "Pilihan tamu".

## Business Types
- Tipe bisnis: General / EV Charging Locator.

## Database Changes
- Tidak ada.

## UI Changes
- **Peta (`src/components/ChargerMap.jsx`)**:
  - Mengimpor `leaflet/dist/leaflet.css` untuk menerapkan positioning stylesheet bawaan Leaflet pada ubin peta.
- **Daftar List Samping (`src/components/ChargerList.jsx`)**:
  - Menghapus badge `"Pilihan tamu"` dan tombol ikon hati (`Heart`) pada wrapper gambar stasiun.
- **Styling Layout (`src/index.css`)**:
  - Mengatur `.card-details` menjadi `flex: 1` dan `min-width: 0` agar muat dalam kontainer list tanpa mendesak ubin DOM.
  - Membatasi `.card-title` dengan `-webkit-line-clamp: 2` (maksimal 2 baris) dan `white-space: normal` agar teks panjang turun ke baris berikutnya secara rapi.

## Data Flow
- Alur data tetap sama.

## Success Criteria
- [ ] Peta Leaflet termuat dengan ubin sejajar sempurna dari ujung ke ujung tanpa kotak abu-abu atau petak ubin yang bertumpukan salah.
- [ ] Daftar kartu stasiun EV di sidebar kiri muat sempurna tanpa memicu horizontal scrollbar.
- [ ] Judul stasiun EV yang panjang dibatasi maksimal 2 baris dan diakhiri dengan tanda elipsis (`...`).
- [ ] Tombol love dan badge "Pilihan tamu" tidak lagi ditampilkan di dalam antarmuka kartu list.
