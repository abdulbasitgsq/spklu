# Spec: Perbaikan Bug Pemotongan Dropdown Filter (Filter Bar Overflow Fix)

## Objective
Mengatasi masalah visual menu pilihan dropdown kustom (`SearchableSelect`) yang terpotong/tidak terlihat dengan mengonfigurasi batas overflow kontainer filter bar menjadi visible.

## Business Types
- Tipe bisnis: General / EV Charging Locator.

## Database Changes
- Tidak ada.

## UI Changes
- **Filter Bar Styles (`src/index.css`)**:
  - Properti overflow `.filter-bar` diubah menjadi `visible` agar menu melayang dapat muncul sepenuhnya ke luar kontainer.
  - Menghapus garis pembatas kanan (`border-right`) dari kontainer select group `.filter-select-group`.

## Data Flow
- Tidak ada perubahan alur data.

## Success Criteria
- [ ] Klik pada dropdown filter memunculkan daftar opsi yang melayang secara utuh dan jelas di atas elemen peta dan daftar samping.
