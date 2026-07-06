# Spec: Logo Provider di Daftar List Kartu

## Objective
Mengganti gambar placeholder stasiun EV/mobil pada panel list kiri dengan logo resmi provider/operator layanan (PLN, Shell, Voltron, Starvo, Hyundai) untuk mempermudah identifikasi visual stasiun EV.

## Business Types
- Tipe bisnis: General / EV Charging Locator.

## Database Changes
- Tidak ada.

## UI Changes
- **Daftar List Samping (`src/components/ChargerList.jsx`)**:
  - Menambahkan fungsi pemetaan logo provider berdasarkan nama operator.
  - Memperbarui tag gambar kartu list agar menggunakan URL logo resmi provider dengan kelas CSS `logo-img`.
- **Gaya CSS (`src/index.css`)**:
  - Menambahkan aturan `.card-img.logo-img` dengan `object-fit: contain`, latar belakang putih bersih (`#ffffff`), dan bantalan internal (`padding: 12px`) untuk mencegah pemotongan gambar logo.

## Data Flow
- Alur data tetap sama. Pemetaan logo dilakukan secara dinamis di level React render.

## Success Criteria
- [ ] Kartu stasiun EV di list samping menampilkan logo resmi operator masing-masing secara proporsional.
- [ ] Seluruh logo tampil utuh tanpa terpotong (*contain*) dengan latar belakang kontainer putih bersih.
