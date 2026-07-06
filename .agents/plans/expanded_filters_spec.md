# Spec: Searchable Filters, De-duplicated Connector Pills & Card Address Limits

## Objective
Meningkatkan kemudahan pencarian stasiun dengan membuat input filter dropdown Provinsi dan Operator menjadi searchable dropdown kustom, menyederhanakan data spesifikasi konektor di kartu agar unik, memotong alamat stasiun yang panjang ke maksimal 2 baris, dan memperbarui placeholder pencarian di header.

## Business Types
- Tipe bisnis: General / EV Charging Locator.

## Database Changes
- Tidak ada.

## UI Changes
- **Header (`src/components/Header.jsx`)**:
  - Placeholder input pencarian diganti menjadi "Cari nama SPKLU...".
- **Filter Bar (`src/components/FilterBar.jsx`)**:
  - Dropdown Provinsi dan Operator diganti dari elemen `<select>` bawaan menjadi komponen `<SearchableSelect>` kustom.
- **Searchable Select Component (`src/components/SearchableSelect.jsx`) [NEW]**:
  - Menu dropdown kustom dengan input teks internal yang menyaring opsi pilihan saat diketik, dengan penutupan otomatis saat klik di luar area (*click outside*).
- **Charger List Card (`src/components/ChargerList.jsx`)**:
  - Tampilan colokan daya stasiun di-deduplikasi sehingga tidak menampilkan label yang sama berulang kali di satu kartu stasiun.
- **Card Styling (`src/index.css`)**:
  - Membatasi alamat `.card-address` maksimal 2 baris menggunakan flexbox clamp.
  - Menambahkan styling menu dropdown kustom untuk `.searchable-select` dan `.searchable-select-menu`.

## Data Flow
- `SearchableSelect` mendengarkan perubahan string pencarian lokal dan memfilter daftar array opsi sebelum merendernya. Mengklik opsi memanggil `onChange` dengan nilai opsi terpilih.

## Success Criteria
- [ ] Placeholder pencarian atas tertulis "Cari nama SPKLU...".
- [ ] Dropdown Provinsi dan Operator dapat diklik dan diketik untuk mencari nama provinsi/operator secara instan.
- [ ] Kartu stasiun hanya menampilkan satu badge/pill untuk setiap spesifikasi daya konektor unik (tidak ada duplikat).
- [ ] Alamat stasiun yang panjang pada list samping kiri terpotong rapi maksimal 2 baris.
