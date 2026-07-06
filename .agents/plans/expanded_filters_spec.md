# Spec: Panel Filter Terpadu (Provinsi, Kota, Provider, & Kecepatan)

## Objective
Menyediakan mekanisme filtering spasial dan operasional tingkat lanjut (Provinsi, Kota/Kabupaten, Provider/Operator, dan Kecepatan Charger) untuk menyaring 4.707 stasiun pengisian daya EV secara kumulatif. Hal ini memudahkan pencarian stasiun pengisian secara presisi serta mengoptimalkan performa rendering list dan peta.

## Business Types
- Tipe bisnis: General / EV Charging Locator.

## Database Changes
- Tidak ada.

## UI Changes
- **Filter Bar (`src/components/FilterBar.jsx` & `src/index.css`)**:
  - Menambahkan empat dropdown select HTML di sebelah kiri filter kategori:
    1. "Semua Provinsi"
    2. "Semua Kota/Kab" (tergantung pada Provinsi terpilih)
    3. "Semua Operator" (PLN, Shell, Voltron, Starvo, Hyundai, dll.)
    4. "Semua Kecepatan" (Standard, Medium, Fast, Ultrafast)
  - Desain dropdown menggunakan select minimalis dengan background putih, border bulat tipis, dan custom arrow SVG.
  - Sederhanakan list filter kategori (menghapus filter operator statis lama karena telah digantikan oleh dropdown operator dinamis).

## Data Flow
- `App.jsx` mengelola state: `selectedProvinsi`, `selectedKabupaten`, `selectedProvider`, `selectedSpeed`.
- Mengompilasi list unik Provinsi, Kota/Kabupaten, dan Operator dari data static.
- Menerapkan filter kumulatif pada dataset sebelum diteruskan ke visualizer list (max 50) dan map (max 200).

## Success Criteria
- [ ] Keempat dropdown selektor termuat secara alfabetis di filter bar.
- [ ] Dropdown Kota/Kabupaten hanya aktif dan menampilkan kota-kota dalam Provinsi yang dipilih.
- [ ] Pemilihan filter pada salah satu dropdown menyaring list & peta seketika.
- [ ] Menghapus filter (kembali ke "Semua") memulihkan pemuatan data nasional dengan lancar.
