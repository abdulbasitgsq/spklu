# Spec: Sinkronisasi Filter Wilayah dengan Layer Perencanaan (Spatial Overlay Sync)

## Objective
Mengintegrasikan filter Provinsi yang dipilih oleh user dengan layer peta perencanaan (heatmap whitespace dan marker POI SPBU/PLN) agar hanya menampilkan lokasi yang berada di provinsi terpilih, mengurangi kepadatan peta, dan meningkatkan kecepatan rendering.

## Business Types
- Tipe bisnis: General / EV Charging Locator & Planner.

## Database Changes
- Tidak ada.

## UI Changes
- **Data Perencanaan (`src/data/planningData.js`)**:
  - Menambahkan kolom `provinsi` pada semua objek data *whitespacePoints*, *spbuLocations*, dan *plnLocations*.
- **Peta Interaktif (`src/components/ChargerMap.jsx`)**:
  - Menambahkan props `selectedProvinsi` ke dalam komponen.
  - Memfilter data perencanaan berdasarkan `selectedProvinsi` sebelum menggambar marker dan lingkaran heatmap ke peta.

## Data Flow
- Ketika user memilih provinsi di dropdown filter bar, state `selectedProvinsi` diperbarui di `App.jsx` dan dialirkan ke `ChargerMap.jsx`. Efek samping Leaflet menangkap pembaruan ini, menghapus layer lama, dan merender layer baru yang telah difilter secara spasial.

## Success Criteria
- [ ] Layer whitespace heatmap dan POI (SPBU, PLN) tersaring secara otomatis mengikuti filter Provinsi yang aktif.
- [ ] Memilih provinsi tanpa data perencanaan (misal: "Bangka Belitung") membersihkan peta dari marker perencanaan wilayah lain secara penuh.
