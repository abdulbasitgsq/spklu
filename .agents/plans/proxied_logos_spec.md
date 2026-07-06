# Spec: Perbaikan Logo Provider (Bypass Hotlink Protection)

## Objective
Mengatasi masalah logo operator (PLN, Shell, Hyundai) yang pecah di browser dengan membungkus URL gambar eksternal menggunakan layanan proxy gambar publik `images.weserv.nl` demi membypass proteksi hotlink.

## Business Types
- Tipe bisnis: General / EV Charging Locator.

## Database Changes
- Tidak ada.

## UI Changes
- **Daftar List Samping (`src/components/ChargerList.jsx`)**:
  - Mengubah URL logo eksternal di `getProviderLogoUrl` agar diproxy menggunakan CDN `https://images.weserv.nl/?url=...`.

## Data Flow
- Permintaan pemuatan logo oleh tag `<img>` diarahkan ke `images.weserv.nl`, yang kemudian meneruskannya secara aman ke Wikipedia Commons/sumber asli dan mengirimkan data gambarnya kembali ke browser local.

## Success Criteria
- [ ] Logo PLN, Shell, dan Hyundai termuat dengan sukses dan utuh tanpa ada broken image di browser lokal pengguna.
