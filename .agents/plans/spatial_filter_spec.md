# Spec: Poligon Whitespace Otomatis untuk Semua Provinsi (Dynamic Spatial Mismatch Fallback)

## Objective
Mengatasi masalah hilangnya visualisasi heatmap poligon whitespace saat memfilter provinsi yang belum memiliki koordinat perencanaan statis (seperti Lampung). Hal ini dicapai dengan men-generate poligon tiruan secara dinamis di sekitar koordinat rata-rata stasiun pada wilayah terpilih.

## Business Types
- Tipe bisnis: General / EV Charging Locator & Planner.

## Database Changes
- Tidak ada.

## UI Changes
- **Peta Interaktif (`src/components/ChargerMap.jsx`)**:
  - Menambahkan fungsi pembangun poligon dinamis `generateMockSpatialMismatch` berpusat di koordinat stasiun yang aktif.
  - Menjadikan poligon dinamis ini sebagai fallback utama jika data statis di `planningData.js` tidak tersedia untuk wilayah yang dipilih.

## Data Flow
- Saat user memfilter provinsi (misal: "Lampung"), `ChargerMap` menghitung rata-rata lat/lng dari array stasiun Lampung, lalu menggambar poligon suplai & celah di sekitar pusat wilayah tersebut.

## Success Criteria
- [ ] Whitespace heatmap poligon biru dan merah tampil di semua provinsi termasuk Lampung.
