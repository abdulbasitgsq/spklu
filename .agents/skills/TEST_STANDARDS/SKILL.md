---
name: TEST_STANDARDS
description: Pedoman pembuatan unit test yang stabil, penanganan mock global, dan strategi menghindari timeout di Kula POS.
---

# Pedoman Unit Test Kula POS

Saat membuat fitur baru dan unit test baru, WAJIB mengikuti pedoman berikut agar test suite tetap stabil (100% lulus) dan terhindar dari *flaky tests*, *memory leaks*, dan *timeout*.

## 1. Wajib Menggunakan Global Mock
Sistem kita memiliki fondasi mock global di `src/setupTests.js`. Jangan membuat mock lokal (menggunakan `vi.mock(...)` di dalam file test) untuk dependensi inti ini:
- **`supabase` / `supabaseHelper`**: Mock global sudah mencakup rantai query lengkap (`select`, `eq`, `gte`, `in`, dll) dan sistem *realtime channel*.
- **`useBusinessType`**: Mock global sudah mendukung verifikasi fitur antar tipe bisnis (F&B, Retail, dll) beserta fungsi pendukung seperti `checkSetting`, `hasFeature`, dan `term`.
- **`LanguageContext` / Translations**: Gunakan terjemahan dari mock global. Jangan memotong hook translasi secara lokal.

*Jika mock global terasa kurang lengkap untuk kasus Anda, **tambahkan fitur tersebut ke `setupTests.js`**, JANGAN meng-override-nya di file test secara lokal.*

## 2. Strategi Asersi Teks (Multi-Bahasa)
Kula POS mendukung multi-bahasa. Untuk memastikan test tahan banting terhadap perubahan bahasa:
- **Gunakan Regex Fleksibel**: `expect(screen.getByText(/kata kunci/i))` lebih disarankan daripada string eksak jika memungkinkan.
- **Daftarkan ID Translasi Baru**: Jika Anda menambah key bahasa baru (misal: `fitur.baru.judul`), pastikan Anda juga menambahkannya ke objek `idMap` di dalam `src/setupTests.js` agar asersi test dapat menangkap teks bahasa Indonesianya dengan benar.

## 3. Pencegahan Timeout pada JSDOM
Menjalankan puluhan komponen React berat di memori (JSDOM) dapat menyebabkan CPU *bottleneck* dan *timeout* acak:
- Gunakan `await waitFor(...)` dengan *timeout* spesifik jika menunggu operasi async yang panjang.
- Bersihkan render dengan `cleanup()` jika melakukan banyak test dalam satu blok yang memakan banyak DOM nodes.
- Jika test membutuhkan `act(...)` pastikan semua *state updates* terjadi dalam pembungkus tersebut.

## 4. Pola Golden Path
Fokuskan unit test pada *Golden Path* (skenario sukses utama) dan beberapa skenario kegagalan kritis. Hindari menguji terlalu dalam ke implementasi detail pihak ketiga (seperti internal shadcn/ui) yang membuat test rentan patah hanya karena perubahan UI kecil.
