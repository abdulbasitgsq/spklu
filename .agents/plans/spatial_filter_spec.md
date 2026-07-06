# Spec: Poligon Mismatch Spasial Organik (Organic Spatial Mismatch Polygons)

## Objective
Mengganti bentuk visual poligon perencanaan yang sebelumnya berupa kotak kecil kaku menjadi bentuk poligon meliuk alami (organik) skala kota berukuran besar (radius 3-5 kilometer) untuk memetakan suplai dan celah pasar secara realistis sesuai contoh referensi.

## Business Types
- Tipe bisnis: General / EV Charging Locator & Planner.

## Database Changes
- Tidak ada.

## UI Changes
- **Peta Interaktif (`src/components/ChargerMap.jsx`)**:
  - Implementasi fungsi proyeksi `generateOrganicPolygon` dengan noise matematika untuk menggambar bentuk poligon alami yang melingkari pusat stasiun wilayah terpilih.
  - Membesarkan skala poligon suplai menjadi radius 3,2 km dan celah gap menjadi radius 4,8 km dengan pergeseran offset agar bertumpuk secara realistis.

## Data Flow
- ChargerMap menghitung rata-rata lat/lng wilayah aktif, men-generate poligon organik bersisi 12 berdasarkan skala jarak meter, dan merendernya ke peta.

## Success Criteria
- [ ] Poligon suplai (Biru) dan celah gap (Merah) di peta berbentuk meliuk alami (organik) dan berukuran besar menutupi area metropolitan/kota.
