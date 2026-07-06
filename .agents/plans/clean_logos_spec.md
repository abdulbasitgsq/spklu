# Spec: Pembersihan & Standardisasi Logo Provider

## Objective
Meningkatkan kerapian visual kartu stasiun EV di list samping kiri dengan menghapus teks badge tumpang tindih dan menerapkan visual placeholder generik berbasis SVG + Teks untuk operator tanpa logo resmi.

## Business Types
- Tipe bisnis: General / EV Charging Locator.

## Database Changes
- Tidak ada.

## UI Changes
- **Daftar List Samping (`src/components/ChargerList.jsx`)**:
  - Menghapus badge teks (`card-badge`) melayang yang menumpuk di atas logo.
  - Memperbarui `getProviderLogoUrl` agar mengembalikan `null` untuk operator non-utama.
  - Menambahkan rendering kondisional SVG petir (Zap) + Teks Operator untuk stasiun EV dengan operator non-utama.
- **Gaya CSS (`src/index.css`)**:
  - Menambahkan gaya `.generic-logo-wrapper`, `.generic-logo-svg`, dan `.generic-logo-text` untuk visual lencana operator.

## Data Flow
- Alur data tetap sama. Pemetaan logo dilakukan secara dinamis di level React render.

## Success Criteria
- [ ] Tidak ada lagi teks badge melayang (`PLN SPKLU`, `OTHER/GENERAL`) di atas logo stasiun.
- [ ] Operator non-utama menampilkan lencana abu-abu terang berisi ikon petir aksen merah muda dan teks nama operator secara rapi.
