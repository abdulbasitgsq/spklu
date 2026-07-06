# Spec: Modifikasi Tata Letak (Header & Split View 30/70)

## Objective
Melakukan modifikasi minor pada tata letak dan navigasi utama:
1. Menghapus navigasi "Jadi Host Charger" untuk menyederhanakan header.
2. Mengubah rasio visual split-screen dari 55/45 menjadi **30% list** dan **70% map** agar peta lebih dominan.
3. Menyesuaikan grid kartu charger menjadi baris horizontal (`[Image | Info SPKLU]`) agar muat di panel daftar yang lebih ramping (30% lebar layar).

## Business Types
- Tipe bisnis: General / EV Charging Locator.

## Database Changes
- Tidak ada.

## UI Changes
- **Header (`Header.jsx`)**:
  - Hapus tombol "Jadi Host Charger".
- **List Panel (`index.css`)**:
  - Ubah `.list-panel` width menjadi `30%` (min-width: `360px`).
  - Ubah `.map-panel` width menjadi `70%`.
- **Charger Card (`index.css` & `ChargerList.jsx`)**:
  - Ubah `.chargers-grid` menjadi single-column vertical list.
  - Ubah `.charger-card` menjadi flex row (`flex-direction: row`).
  - Sisi kiri: `.card-image-wrapper` (gambar) dengan lebar tetap (misal: `120px` atau `35%`).
  - Sisi kanan: `.card-details` berisi nama stasiun, konektor, harga, dan status.

## Data Flow
- Alur data tetap sama menggunakan props.

## Success Criteria
- [ ] Tombol "Jadi Host Charger" hilang dari header.
- [ ] Panel kiri (daftar) berukuran 30% lebar layar dan panel kanan (peta) berukuran 70% lebar layar.
- [ ] Kartu list memiliki layout baris horizontal dengan gambar di kiri dan info di kanan.
- [ ] Tidak ada teks yang tumpang tindih atau melimpah keluar kontainer pada panel kiri yang ramping.
