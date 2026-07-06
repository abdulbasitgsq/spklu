---
name: IMPORT_CHECK
description: Strict rules for preventing ReferenceErrors, missing imports (Lucide icons), and Temporal Dead Zone (TDZ) crashes (e.g. error 'c').
---

# Pencegahan Error Kritis (ReferenceError & TDZ) di Kula POS

Seringkali perubahan kode yang sepele bisa menyebabkan layar putih (*White Screen of Death*) di *production*. Saat memodifikasi atau membuat fitur baru, **WAJIB** mematuhi pedoman berikut:

## 1. Mencegah Missing Imports (Lucide & UI Components)
Kesalahan paling umum adalah memanggil komponen di dalam JSX namun lupa meng-import-nya di bagian atas file.
- **Lucide Icons**: Setiap kali menggunakan ikon baru (misal: `<FileText />`), Anda WAJIB memastikan ikon tersebut ditambahkan ke daftar `import { ..., FileText } from 'lucide-react';`. Jangan berasumsi ikon sudah ada!
- **UI Components**: Saat menggunakan `<Button>`, `<Input>`, `<Dialog>`, atau `<Table>`, pastikan baris `import { ... } from '@/components/ui/...'` tersedia.
- **React Hooks**: `useMemo`, `useCallback`, `useEffect` WAJIB di-import dari `'react'`.

## 2. Mencegah Temporal Dead Zone (TDZ) / Error 'c'
Error misterius seperti `ReferenceError: Cannot access 'c' before initialization` di production biasanya disebabkan oleh variabel (seringkali konfigurasi raksasa) yang didefinisikan dengan `const` di dalam komponen, lalu dipanggil prematur oleh *hook* sebelum baris eksekusinya. Saat di-*minify* (dikompresi), nama variabelnya diubah menjadi singkatan seperti `c`.
- **Keluarkan Konstanta Statis**: Jika Anda memiliki array atau objek konfigurasi konstan (contoh: daftar fitur, harga paket langganan, list bank) yang **tidak bergantung** pada *state* atau *props* React, **keluarkan variabel tersebut ke LUAR blok deklarasi komponen (`const MyComponent = () => {...}`).**
- **Urutan Deklarasi Hooks**: Pastikan variabel *state* atau fungsi yang dibutuhkan oleh sebuah `useMemo` / `useCallback` sudah dideklarasikan **sebelum** blok *hook* tersebut ditulis.

## 3. Destructuring Context yang Aman
Saat mengambil data dari *global context* (seperti `useData()` atau `useLanguage()`), pastikan Anda mengantisipasi skenario di mana data belum selesai di-load.
- **Gunakan Fallback**: `const { currentStore = {} } = useData();`
- **Optional Chaining**: Hindari langsung memanggil `currentStore.settings.theme`, gunakan `currentStore?.settings?.theme`.

Dengan mematuhi 3 aturan ini, kita dapat mencegah 90% error runtime (*crash*) yang sering terjadi saat fitur di-deploy ke Vercel!
