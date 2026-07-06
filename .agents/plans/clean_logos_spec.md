# Spec: Penyelarasan Desain Dropdown Filter (Filter Select Unification)

## Objective
Menyamakan visual seluruh elemen dropdown di filter bar (baik kustom maupun bawaan) agar seragam dalam hal tinggi, lebar, border-radius, font, dan panah kanan.

## Business Types
- Tipe bisnis: General / EV Charging Locator.

## Database Changes
- Tidak ada.

## UI Changes
- **Filter Bar Styles (`src/index.css`)**:
  - Mengubah `.filter-select` dan `.searchable-select-container` menjadi berdimensi `width: 160px` dan `height: 38px`.
  - Menyamakan style trigger, font-size, font-weight, dan border-radius menjadi `24px` kapsul.
- **Searchable Select Component (`src/components/SearchableSelect.jsx`)**:
  - Mengubah ukuran chevron down menjadi `14px` untuk mencocokkan panah dropdown select bawaan browser.

## Data Flow
- Tidak ada perubahan alur data.

## Success Criteria
- [ ] Keempat dropdown filter (Provinsi, Kota/Kab, Operator, Kecepatan) memiliki tampilan fisik yang seragam, sejajar, dan berukuran sama.
