---
name: BUSINESS_TYPE_STANDARDS
description: Pedoman penanganan fitur dan terminologi berbasis tipe bisnis (F&B, Farmasi, Retail, dll) secara modular di KULA POS.
---

# Penanganan Tipe Bisnis (Business Types)

KULA POS mendukung berbagai vertikal bisnis. Kodenya harus modular dan tidak boleh banyak menggunakan pengkondisian hardcoded.

## 1. Gunakan useBusinessType Hook
Jangan pernah melakukan pengecekan tipe bisnis secara manual seperti `if (type === 'pharmacy')`. Gunakan hook `useBusinessType`.
- **Fitur**: `const { hasFeature } = useBusinessType(); if (hasFeature('recipe')) { ... }`
- **Terminologi**: `const { term } = useBusinessType(); <span>{term('product')}</span>` (ini akan otomatis berubah jadi "Obat" di Farmasi atau "Menu" di F&B).

## 2. Konfigurasi di businessTypes.js
Setiap fitur baru yang spesifik tipe bisnis harus didaftarkan di `src/config/businessTypes.js`.
- Tambahkan flag fitur di dalam array `features`.
- Tambahkan terminologi khusus di objek `terminology`.

## 3. Modularitas
- Jika sebuah komponen hanya berlaku untuk tipe bisnis tertentu (misal: `CompoundingDialog`), lakukan *conditional rendering* berdasarkan fitur, bukan tipe bisnis secara langsung.
- Pastikan komponen bersifat generik dan dapat menerima konfigurasi dari `useBusinessType`.

## 4. UI/UX Spesifik
- Gunakan `checkSetting('enableExpiryTracking')` atau sejenisnya untuk menyembunyikan/menampilkan kolom tabel yang hanya relevan bagi vertikal tertentu.
