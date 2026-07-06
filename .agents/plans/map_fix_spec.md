# Spec: Perbaikan Visual Peta (Leaflet Grey-Blocks & Misalignment)

## Objective
Mengatasi bug visual pada peta Leaflet di mana sebagian ubin peta (tiles) tidak termuat dengan sempurna (meninggalkan kotak abu-abu kosong). Masalah ini terjadi karena inisialisasi peta mendahului kalkulasi ukuran kontainer di split-view layout.

## Business Types
- Tipe bisnis: General / EV Charging Locator.

## Database Changes
- Tidak ada.

## UI Changes
- **Charger Map (`src/components/ChargerMap.jsx`)**:
  - Memicu pembaruan ukuran peta via `map.invalidateSize()` sesaat setelah inisialisasi peta dan saat setiap kali dataset marker diperbarui.

## Data Flow
- Alur data tetap sama.

## Success Criteria
- [ ] Peta Leaflet terisi penuh oleh ubin peta (tiles) dari ujung ke ujung tanpa kotak abu-abu kosong saat pertama kali dimuat.
- [ ] Mengubah ukuran window, melakukan filter, atau memicu detail drawer tidak merusak visual peta.
- [ ] Penanda (marker) price-tag terposisikan secara presisi pada koordinat aslinya.
