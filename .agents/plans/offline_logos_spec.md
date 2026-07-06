# Spec: Logo Provider Mandiri (Offline SVG Logo Cards)

## Objective
Mengatasi masalah logo operator (PLN, Shell, Hyundai, dll.) yang pecah di browser dengan merender logo menggunakan SVG Inline + Lencana Kartu Berwarna secara langsung di tingkat kode JSX, menjamin 100% ketersediaan offline dan bypass hotlinking block.

## Business Types
- Tipe bisnis: General / EV Charging Locator.

## Database Changes
- Tidak ada.

## UI Changes
- **Daftar List Samping (`src/components/ChargerList.jsx`)**:
  - Menghapus fungsi pembantu URL gambar eksternal `getProviderLogoUrl`.
  - Mengimplementasikan `renderProviderLogo` untuk merender JSX Lencana Kartu yang berisi SVG inline dan nama brand operator (PLN, Shell, Voltron, Starvo, Hyundai).
- **Gaya CSS (`src/index.css`)**:
  - Menambahkan gaya untuk `.provider-logo-card`, `.provider-logo-card.pln`, `.provider-logo-card.shell`, dll. untuk mewarnai latar belakang kartu lencana logo masing-masing brand secara akurat.

## Data Flow
- Alur data tetap sama. Rendering SVG dilakukan secara internal di client-side JSX tanpa HTTP request eksternal.

## Success Criteria
- [ ] Seluruh kartu stasiun EV di list samping kiri memuat logo provider yang valid (tidak pecah/broken image) 100% instan.
