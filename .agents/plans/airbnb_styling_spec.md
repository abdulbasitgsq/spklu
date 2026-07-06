# Spec: Overhaul Font dan Styling Airbnb (Persis Screenshot)

## Objective
Mengubah seluruh visual, layout, font, dan warna aplikasi `charge-bnb` dari tema gelap (dark mode) saat ini ke tema terang (light mode) yang **persis sama** dengan antarmuka Airbnb asli sesuai screenshot yang diberikan. Tujuannya adalah menghadirkan nuansa premium, bersih, dan fungsionalitas yang identik dengan layout split-screen Airbnb.

## Business Types
- Tipe bisnis: General / EV Charging Marketplace.

## Database Changes
- Tidak ada perubahan database schema maupun RLS.

## UI Changes
- **Header (`src/components/Header.jsx`)**:
  - Logo berwarna merah aksen `#ff385c`.
  - Search bar berbentuk pil lonjong putih dengan bayangan halus, diakhiri dengan tombol lingkaran merah berisi ikon search putih di ujung kanan.
  - Menu profil (hamburger + avatar) dengan warna teks gelap `#222222`.
- **Filter Bar (`src/components/FilterBar.jsx`)**:
  - Pill filter dengan background putih, border tipis abu-abu `#dddddd`, teks abu-abu gelap `#222222`.
  - Indikator aktif berupa border hitam tebal atau merah aksen.
- **List Panel & Card (`src/components/ChargerList.jsx`)**:
  - Layout kartu charger dengan border-radius `12px` untuk gambar charger.
  - Indikator dot slider gambar.
  - Tombol favorit (hati) dengan outline putih dan isi merah `#ff385c` saat aktif.
  - Badge "Pilihan tamu" melengkung warna putih di pojok kiri atas gambar jika rating >= 4.7.
  - Formatting tarif/kWh bold diikuti `/ kWh` di bagian bawah.
- **Interactive Map (`src/components/ChargerMap.jsx`)**:
  - Tile layer diganti ke CartoDB Positron terang: `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`.
  - Marker berbentuk "Price Tag" nominal harga terendah (misal: `Rp 2.4k`).
  - Latar tag harga aktif/dipilih menjadi hitam pekat, tulisan putih.
- **Detail Modal (`src/components/ChargerDetail.jsx`)**:
  - Latar overlay abu-abu semi-transparan tipis.
  - Kontainer putih bersih, sticky booking card di sisi kanan dengan tombol reservasi merah `#ff385c`.

## Data Flow
- Komponen UI mengonsumsi data statis dari `src/data/chargers.js` seperti biasa.
- Klik marker peta atau klik kartu memperbarui `activeChargerId` di `App.jsx`, yang kemudian menyinkronkan status aktif pada kedua visualizer (list dan map).
- Detail modal diaktifkan melalui event `onOpenDetail` yang memicu dialog detail berlatar terang.

## Success Criteria
- [ ] Tampilan latar belakang aplikasi berwarna putih bersih (`#ffffff`) dengan pembatas border tipis (`#ebebeb`).
- [ ] Font utama konsisten menggunakan font sans-serif modern (Inter) dengan ketebalan teks (font-weight) yang kontras.
- [ ] Header, search bar, dan user menu tersusun rapi secara horizontal dan memiliki dimensi visual identik dengan screenshot Airbnb.
- [ ] Peta interaktif menggunakan tema terang dan menampilkan marker berbentuk "Price Tag" putih yang berubah menjadi hitam saat aktif.
- [ ] Kartu charger memiliki visual bersih dengan gambar sudut melengkung, rating bintang, metadata abu-abu, ketersediaan konektor, badge "Pilihan tamu", dan harga kWh dengan styling bold.
- [ ] Detail modal memiliki layout split dengan form reservasi di sisi kanan dan detail konektor di sisi kiri.
