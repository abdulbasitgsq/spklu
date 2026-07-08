# Spec: Dynamic Suitability Weights & Interactive Site Selection Sidebar

## Objective
Mengubah model analisis perencanaan whitespace dari yang sebelumnya statis menjadi dinamis dan interaktif. User dapat mengatur bobot kriteria penentuan lokasi baru (Site Selection) langsung dari panel sidebar/control di samping peta. Kriteria-kriteria ini mencakup Kepadatan POI Komersial, Kapasitas Listrik PLN, Aksesibilitas Lalu Lintas, dan Kompetisi (Jarak ke EV Charger Terdekat). 

Semua visualisasi peta (grid celah pasar & lingkaran whitespace) serta daftar peringkat rekomendasi di sidebar/kartu akan dihitung ulang secara dinamis menggunakan pembobotan (*weighted average*) dari input user.

## Business Types
- Tipe bisnis: General / EV Charging Planning & Analytics.

## Database Changes
- Tidak ada. Seluruh kalkulasi pembobotan dilakukan secara *client-side* pada component React untuk memberikan umpan balik instan (FPS tinggi).

## UI Changes
- **Layout Peta & Sidebar (`src/components/ChargingTypeDetail.jsx`)**:
  - Mengubah layout bagian peta menjadi kolom ganda: Sidebar Kriteria (kiri, lebar 320px) dan Map Container (kanan, sisa lebar layar).
  - Di dalam Sidebar Kriteria, tambahkan slider kontrol (skala 0 - 10) untuk:
    1. **Kepadatan POI Komersial** (Ikon `Building2`)
    2. **Kapasitas Jaringan PLN** (Ikon `Zap`)
    3. **Aksesibilitas & Lalu Lintas** (Ikon `Navigation`)
    4. **Jarak SPKLU (Hindari Kompetisi)** (Ikon `LayoutGrid` / `BatteryCharging`)
  - Menyediakan tombol pintasan preset bobot cepat (*Quick Presets*):
    - **Seimbang**: Semua bobot bernilai 5.
    - **Fokus Transit (Jalan Tol/Utama)**: Bobot Lalu Lintas tinggi.
    - **Fokus Ritel/Tujuan**: Bobot POI Komersial tinggi.
    - **Fokus Celah Pasar (Hindari Kompetisi)**: Bobot Jarak SPKLU tinggi.
- **Daftar Rekomendasi & Tabel Grid Teratas (`src/components/ChargingTypeDetail.jsx`)**:
  - Kartu rekomendasi dan tabel grid dihitung ulang skor kelayakannya dan di-sort ulang secara real-time mengikuti pergeseran slider kriteria.

## Data Flow
1. User menggeser slider kriteria di sidebar kustom.
2. State `weights` (`poi`, `pln`, `traffic`, `competition`) diperbarui di `ChargingTypeDetail.jsx`.
3. Komponen menghitung ulang:
   - Skor `overall` pada daftar whitespace:
     $$\text{overall} = \frac{(W_{\text{poi}} \cdot S_{\text{poi}} + W_{\text{pln}} \cdot S_{\text{pln}} + W_{\text{traffic}} \cdot S_{\text{traffic}} + W_{\text{comp}} \cdot S_{\text{comp}}) \times 10}{W_{\text{poi}} + W_{\text{pln}} + W_{\text{traffic}} + W_{\text{comp}}}$$
   - Skor `gap` pada setiap sel dalam `gridCells` secara dinamis:
     - `poiDensity`: disimulasikan dari `cell.poi_medium` atau `cell.poi_fast`.
     - `competition`: disimulasikan dari kebalikan `cell.supply_medium` or `cell.supply_fast` (semakin sedikit supply, semakin tinggi skor peluang celah kompetisi).
     - `plnGrid` & `traffic`: disimulasikan secara deterministik dari koordinat sel menggunakan pseudo-random seed agar konsisten namun interaktif.
4. Layer rectangle Leaflet dan circle whitespace menggambar ulang warna fill dan opacitasnya berdasarkan hasil kalkulasi skor gap dinamis terbaru.

## Success Criteria
- [ ] Tersedia sidebar kustom dengan 4 slider kriteria dan panel Quick Presets.
- [ ] Warna/opasitas grid sel spasial pada peta berubah seketika (real-time) saat slider digeser.
- [ ] Daftar Kartu Rekomendasi di bagian bawah dan Tabel Top 10 Priority Grids langsung terurut ulang berdasarkan hasil skor baru.
- [ ] Kriteria "Existing EV Charger" (Kompetisi) secara aktif mengurangi skor peluang jika diatur berbobot tinggi pada grid sel yang sudah memiliki supply.
