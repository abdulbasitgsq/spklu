# Spec: Penghapusan Status Ketersediaan (Tersedia / Sedang Dipakai / Offline)

## Objective
Menyederhanakan visual kartu stasiun EV di list samping kiri dengan menghapus indikator status ketersediaan (Tersedia / Sedang Dipakai / Offline) yang disimulasikan dari backend/data.

## Business Types
- Tipe bisnis: General / EV Charging Locator.

## Database Changes
- Tidak ada.

## UI Changes
- **Daftar List Samping (`src/components/ChargerList.jsx`)**:
  - Menghapus rendering blok `<div className="status-badge">` pada footer kartu.
  - Menghapus variabel penentu status keseluruhan stasiun.

## Data Flow
- Alur data tetap sama.

## Success Criteria
- [ ] Teks status ketersediaan beserta indikator bulat berwarna tidak lagi dimuat di footer kartu stasiun EV list samping kiri.
