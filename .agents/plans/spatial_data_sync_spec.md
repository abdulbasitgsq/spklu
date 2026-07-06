# Spec: Sinkronisasi Data Wilayah (Provinsi & Kabupaten/Kota)

## Objective
Mengintegrasikan properti `provinsi` yang terlewatkan dari dataset scrap ke dalam data front-end static `src/data/chargers.js`. Perubahan ini menyinkronkan filter dropdown wilayah (Provinsi dan Kota/Kabupaten) dengan data stasiun EV secara riil.

## Business Types
- Tipe bisnis: General / EV Charging Locator.

## Database Changes
- Tidak ada.

## UI Changes
- Tidak ada perubahan kode UI baru (UI dropdown sudah siap). Perubahan ini menyinkronkan data di balik UI agar pilihan dropdown Provinsi dan Kabupaten/Kota terisi secara otomatis dari dataset scrap.

## Data Flow
- Kolom `provinsi` dari `ev_chargers_indonesia.json` dipetakan ke properti `"provinsi"` di `src/data/chargers.js`.
- Dropdown Provinsi di `FilterBar` otomatis menarik data unik provinsi yang telah dibersihkan (trimmed).
- Saringan data regional pada peta dan sidebar kembali aktif.

## Success Criteria
- [ ] Dropdown Provinsi menampilkan daftar unik provinsi riil dari data hasil scrap secara alfabetis.
- [ ] Dropdown Kabupaten/Kota dinonaktifkan secara default, dan aktif ketika salah satu provinsi dipilih.
- [ ] Memilih kombinasi Provinsi/Kota memperbarui visualisasi list stasiun EV dan peta Leaflet secara akurat.
