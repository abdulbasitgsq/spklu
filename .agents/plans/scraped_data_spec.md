# Spec: Integrasi Data Hasil Scrap (4.707 Lokasi EV)

## Objective
Mengintegrasikan dataset hasil scrap sebanyak **4.707 stasiun pengisian daya EV** di Indonesia ke dalam aplikasi `charge-bnb`. Untuk mencegah masalah performa (*lagging* / *crash*) akibat merender ribuan elemen secara bersamaan, kita akan menerapkan teknik limitasi rendering (slicing) pada daftar list dan marker peta.

## Business Types
- Tipe bisnis: General / EV Charging Locator.

## Database Changes
- Tidak ada.

## UI Changes
- **List Panel (`src/components/ChargerList.jsx`)**:
  - Hanya merender 50 stasiun pertama dari total hasil filter.
  - Tampilkan petunjuk jika hasil lebih dari 50: *"Menampilkan 50 stasiun teratas..."*.
- **Peta (`src/components/ChargerMap.jsx`)**:
  - Hanya merender 200 marker pertama dari total hasil filter untuk menjaga performa pemetaan Leaflet.

## Data Flow
- `ev_chargers_indonesia.json` ditransformasikan menjadi objek data static `src/data/chargers.js` menggunakan script Python.
- Struktur mapping kolom:
  - `id`: `"ch-" + item.id`
  - `name`: `item.nama_lokasi`
  - `operator`: `item.provider`
  - `address`: `item.alamat`
  - `city`: `item.kabupaten_kota`
  - `lat`: `item.latitude`
  - `lng`: `item.longitude`
  - `rating`: Diacak secara konsisten berdasarkan ID stasiun (`4.5` s.d `5.0`).
  - `reviewsCount`: Diacak secara konsisten berdasarkan ID stasiun (`5` s.d `100`).
  - `image`: Diberikan gambar Unsplash bertema SPKLU yang sesuai dengan provider-nya.
  - `connectors`: Disimulasikan berdasarkan kolom `watt` dan `jumlah_konektor`.
- UI utama mengonsumsi `chargersData` dari static file tersebut.

## Success Criteria
- [ ] Titik-titik SPKLU riil se-Indonesia dari dataset scrap berhasil termuat di peta dan list panel.
- [ ] Fitur pencarian lokasi (Jakarta, Bandung, Bali, dll.) bekerja responsif dan tepat memosisikan peta ke koordinat stasiun terkait.
- [ ] Performa list panel dan peta interaktif Leaflet tetap 60 FPS (lancar) tanpa screen freeze saat memuat seluruh data.
