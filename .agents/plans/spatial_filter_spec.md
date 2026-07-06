# Spec: Heatmap Mismatch Grid Sel (Spatial Analysis Grid Overlay)

## Objective
Mengubah visualisasi perencanaan peta dari poligon tunggal menjadi Grid Sel Spasial 2D (Spatial Grid Overlay) yang padat dengan sel-sel persegi transparan berwarna biru (suplai) dan merah gradasi (celah pasar) beserta tooltip melayang berisi metrik analitis (Grid ID, POIs, Supply, Gap Score) saat disorot mouse.

## Business Types
- Tipe bisnis: General / EV Charging Locator & Planner.

## Database Changes
- Tidak ada.

## UI Changes
- **Peta Interaktif (`src/components/ChargerMap.jsx`)**:
  - Implementasi grid 2D menggunakan Leaflet `L.rectangle`.
  - Penambahan popup tooltip melayang (`L.tooltip` dengan opsi `sticky: true`) untuk menampilkan metrik analitis.

## Data Flow
- ChargerMap membagi bounding box wilayah stasiun aktif menjadi $20 \times 20$ sel, menentukan status sel secara deterministik, dan merendernya dengan tooltip interaktif.

## Success Criteria
- [ ] Tampil grid sel berwarna biru dan merah pada peta saat perencanaan diaktifkan.
- [ ] Tooltip muncul melayang mengikuti kursor mouse saat menyorot sel, menampilkan Grid ID, POIs, Supply, dan Gap Score yang tepat.
