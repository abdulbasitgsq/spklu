---
description: Buat spesifikasi sebelum mulai fitur baru. Gunakan ketika memulai fitur baru, perubahan schema database, atau modifikasi yang menyentuh lebih dari 3 file.
---

# Spec Workflow — KULA POS

## Kapan Digunakan
- Fitur baru yang melibatkan > 3 file
- Perubahan database schema (tabel/kolom Supabase)
- Fitur yang melibatkan multi-tenant / RLS policy
- Integrasi baru (Telegram, printer, AI, payment gateway)
- Perubahan arsitektur (context, hooks, routing)

## Kapan TIDAK Digunakan
- Fix typo atau single-line change
- Perubahan styling 1-2 komponen
- Update copy/teks UI

## Langkah-Langkah

### Step 1: Identifikasi Scope
Sebelum menulis kode apapun, jawab pertanyaan ini:

```
SCOPE CHECK:
1. Tipe bisnis mana yang terpengaruh? (general/fnb/pharmacy/pet_clinic/pet_shop)
2. Apakah perlu perubahan database? (tabel/kolom/RLS baru)
3. Berapa file yang akan disentuh? (estimasi)
4. Apakah fitur ini plan-gated? (free/pro/enterprise)
5. Apakah perlu migrasi data existing?
```

### Step 2: Surface Assumptions
Sebelum menulis spec, list semua asumsi:

```
ASUMSI YANG SAYA BUAT:
1. [contoh: Data disimpan di Supabase, bukan localStorage]
2. [contoh: RLS policy diperlukan untuk multi-tenant]
3. [contoh: Fitur hanya untuk plan PRO ke atas]
4. [contoh: UI menggunakan ShadCN + Tailwind yang sudah ada]
→ Koreksi sekarang sebelum saya lanjut
```

Jangan silent assumption. Tujuan spec adalah memunculkan kesalahpahaman SEBELUM kode ditulis.

### Step 3: Tulis Spec Document
Gunakan template berikut:

```markdown
# Spec: [Nama Fitur]

## Objective
[Apa yang dibangun, kenapa, dan untuk siapa]

## Business Types
[Tipe bisnis mana: general | fnb | pharmacy | pet_clinic | pet_shop]

## Database Changes
- Tabel baru: [nama tabel + kolom]
- Kolom baru di tabel existing: [tabel.kolom]
- RLS Policy: [deskripsi rule]
- Migration script: [path file .sql]

## UI Changes
- Halaman baru: [path + deskripsi]
- Komponen baru: [nama + deskripsi]
- Komponen yang dimodifikasi: [nama + apa yang berubah]

## Data Flow
[Bagaimana data mengalir dari UI → Context → Supabase dan sebaliknya]

## Success Criteria
- [ ] [Kondisi spesifik dan testable]
- [ ] [Kondisi spesifik dan testable]
- [ ] [Kondisi spesifik dan testable]

## Boundaries
- **Always:** Cek businessTypes.js, gunakan useBusinessType() hook
- **Ask first:** Perubahan schema database, dependency baru
- **Never:** Skip spec untuk fitur > 3 file, hardcode store_id
```

### Step 4: Reframe Vague Requirements
Jika requirement dari user tidak jelas, reframe jadi success criteria:

```
REQUIREMENT: "Buat fitur laporan lebih bagus"

REFRAMED SUCCESS CRITERIA:
- Laporan bisa di-filter berdasarkan tanggal, kategori, dan staff
- Export ke Excel/PDF tersedia
- Grafik interaktif (bar chart + line chart)
- Loading time < 2 detik untuk data 1 bulan
→ Apakah ini yang dimaksud?
```

### Step 5: Review dengan User
**JANGAN mulai coding sebelum spec disetujui user.**

## Anti-Rationalization

| Alasan Skip Spec | Realita |
|---|---|
| "Ini simpel, gak perlu spec" | Task simpel tetap butuh acceptance criteria. Spec 2 baris juga boleh. |
| "Nanti aja spec-nya setelah coding" | Itu dokumentasi, bukan spesifikasi. Value spec ada di clarity SEBELUM coding. |
| "Spec memperlambat" | Spec 15 menit mencegah rework berjam-jam. |
| "User udah jelas maunya" | Bahkan request yang jelas punya asumsi implisit. Spec memunculkan asumsi itu. |

## Red Flags
- Mulai coding tanpa requirement tertulis
- Bertanya "langsung build aja ya?" sebelum tahu definisi "selesai"
- Implementasi fitur yang tidak ada di spec
- Keputusan arsitektur tanpa dokumentasi
