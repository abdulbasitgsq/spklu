# Spec: EV Charging Site Selection & Planning Analytics

## Objective
Memperluas fungsi aplikasi locator menjadi dashboard analitis pemilihan lokasi stasiun pengisian daya EV baru (Site Selection Tool). Fitur baru ini memetakan kesenjangan pasokan (*whitespace heatmap*), meng-overlay titik penting pendukung (*POI overlay*), mengaktifkan pencarian alamat/SPBU, serta mengukur kelayakan pemasangan melalui grid skor kesesuaian (*suitability scoring grid*).

## Business Types
- Tipe bisnis: General / EV Charging Planning & Analytics.

## Database Changes
- Tidak ada database eksternal. Seluruh dataset perencanaan dimodelkan dalam file statis `src/data/planningData.js`.

## UI Changes
- **Floating Control Panel (`src/components/PlanningPanel.jsx`) [NEW]**:
  - Panel melayang di peta untuk menyalakan/mematikan heatmap whitespace dan overlay POI (SPKLU, SPBU, PLN).
- **Suitability Score Card (`src/components/SuitabilityDetail.jsx`) [NEW]**:
  - Panel info kelayakan lokasi (Site Suitability Score) dengan grid progres bar 0-10 untuk kapasitas grid listrik, kemudahan lalu lintas, kepadatan POI sekitar, dan celah kompetisi.
- **Modifikasi Peta (`src/components/ChargerMap.jsx`)**:
  - Rendering layer heatmap menggunakan `L.circle` dengan gradasi transparan warna merah-kuning dan blur.
  - Rendering marker POI dengan ikon khusus (pompa bensin merah untuk SPBU, petir biru untuk PLN).
  - Integrasi callback klik titik heatmap untuk membuka detail kelayakan di sidebar.
- **Modifikasi Sidebar (`src/App.jsx`)**:
  - Logika penggantian tampilan dari list stasiun EV ke detail kelayakan lokasi (*Suitability Score*) ketika whitespace aktif diklik.

## Data Flow
- Memasukkan data perencanaan dari `src/data/planningData.js`.
- Kueri pencarian di header dicocokkan dengan kueri alamat/SPBU di `planningData`. Jika cocok, memicu relokasi viewport peta (`flyTo`).
- Peta memicu callback `onSelectWhitespace` ketika bulatan heatmap diklik, mengirimkan metadata titik whitespace ke `selectedWhitespace` state di `App.jsx`, yang kemudian memicu rendering `SuitabilityDetail` di panel samping.

## Success Criteria
- [ ] Tersedia 4 kategori heatmap whitespace (Slow, Medium, High, Ultrafast) yang dapat dinyalakan bergantian.
- [ ] Tersedia tombol centang POI overlay untuk SPBU dan Kantor PLN yang memunculkan marker ikonik di peta.
- [ ] Kolom pencarian utama mendukung kueri pencarian alamat (seperti "Sudirman", "Dago", "Kuta") dan nama SPBU, memicu pemindahan peta langsung ke koordinat lokasi tersebut.
- [ ] Mengklik titik whitespace memunculkan panel analitik kelayakan pemasangan baru dengan grid kemajuan nilai (Akses Jalan, Grid Listrik, Kepadatan POI, Jarak SPKLU) beserta kesimpulan akhir kelayakan.
