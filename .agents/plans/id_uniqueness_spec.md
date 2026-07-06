# Spec: Sinkronisasi Presisi List & Map (Perbaikan Key Collision)

## Objective
Mengatasi masalah sinkronisasi rendering list dan peta dengan menjamin keunikan ID stasiun EV 100%. Langkah ini menyelesaikan tabrakan key (`key={charger.id}`) di React yang sebelumnya menyebabkan React mendaur ulang elemen DOM stasiun wilayah lain secara tidak tepat.

## Business Types
- Tipe bisnis: General / EV Charging Locator.

## Database Changes
- Tidak ada.

## UI Changes
- Tidak ada perubahan kode UI baru. Pemetaan data di belakang layar (`src/data/chargers.js`) akan diperbarui agar menghasilkan ID unik berbasis urutan indeks (`sc-{idx}`).

## Data Flow
- `map_data_to_frontend.py` menghasilkan ID stasiun EV berformat `sc-{idx}` (di mana `idx` adalah indeks urutan dari array 0 s.d 4706).
- React menerima data dengan key yang 100% unik, sehingga proses rekonsiliasi rendering berjalan presisi dan sinkron dengan filter regional yang dipilih user.

## Success Criteria
- [ ] Setiap stasiun EV di `src/data/chargers.js` memiliki ID unik yang berbeda satu sama lain.
- [ ] Memilih Provinsi menyaring stasiun EV dan memperbarui isi daftar list kiri dengan stasiun wilayah tersebut secara akurat.
- [ ] Peta dan list kiri menunjukkan item stasiun yang sama persis (sinkron).
