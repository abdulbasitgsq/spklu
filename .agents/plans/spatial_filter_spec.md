# Spec: Poligon Mismatch Spasial & Legenda Peta (Spatial Mismatch Heatmap & Legend)

## Objective
Mengganti visualisasi whitespace dari yang sebelumnya berbentuk lingkaran titik menjadi bentuk Poligon Mismatch Spasial (Suplai Aktif vs Celah Permintaan) yang sesuai dengan teori kesenjangan spasial pada referensi proyek `gs-ev-demand.web.app`, lengkap dengan legenda petunjuk warna.

## Business Types
- Tipe bisnis: General / EV Charging Locator & Planner.

## Database Changes
- Tidak ada.

## UI Changes
- **Peta Interaktif (`src/components/ChargerMap.jsx`)**:
  - Menggambar dua jenis area poligon: Area Biru (Suplai SPKLU Aktif) dan Area Merah (Celah Permintaan Kosong/Tinggi).
  - Menampilkan box Legenda Spasial melayang di pojok kanan bawah peta saat fitur heatmap diaktifkan.
- **Styling Legenda (`src/index.css`)**:
  - Menambahkan styling box legenda glassmorphism melayang.

## Data Flow
- Memasukkan data koordinat poligon wilayah Jakarta, Bandung, dan Bali ke dalam `src/data/planningData.js`. Data poligon dibaca dinamis berdasarkan provinsi aktif yang dipilih di filter bar.

## Success Criteria
- [ ] Peta memunculkan visualisasi poligon biru (Existing Supply) dan poligon merah (Demand Gap) saat analisis perencanaan diaktifkan.
- [ ] Legenda peta melayang tampil dengan warna panduan penunjuk yang akurat.
