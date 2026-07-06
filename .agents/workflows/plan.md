---
description: Pecah pekerjaan menjadi task-task kecil yang terurut. Gunakan ketika spec sudah disetujui dan perlu dipecah menjadi unit implementasi, atau ketika task terlalu besar untuk dimulai langsung.
---

# Plan Workflow — KULA POS

## Kapan Digunakan
- Spec sudah ada dan perlu dipecah jadi task implementasi
- Task terasa terlalu besar atau tidak jelas untuk dimulai
- Urutan implementasi tidak obvious
- Perlu estimasi scope

## Kapan TIDAK Digunakan
- Perubahan 1-2 file yang scope-nya sudah jelas
- Spec sudah berisi task yang well-defined

## Langkah-Langkah

### Step 1: Enter Plan Mode (Read-Only)
Sebelum menulis kode, operasikan dalam mode baca-saja:

- Baca spec dan bagian codebase yang relevan
- Identifikasi pattern dan konvensi yang sudah ada
- Map dependencies antar komponen
- Catat risiko dan unknowns

// turbo
**JANGAN tulis kode selama planning. Output-nya adalah plan document.**

### Step 2: Identifikasi Dependency Graph
Map apa yang bergantung pada apa (khusus KULA POS):

```
Supabase Schema (tabel/kolom/RLS)
    │
    ├── DataContext.jsx (query + mutation)
    │       │
    │       ├── Hooks (useBusinessType, usePOS, dll)
    │       │       │
    │       │       └── Pages/Components (UI)
    │       │
    │       └── Services (printer.js, dll)
    │
    └── Migration Scripts (.sql)
```

Implementasi mengikuti dependency graph dari bawah ke atas: bangun fondasi dulu.

### Step 3: Slice Vertikal (Bukan Horizontal)

**Buruk (horizontal slicing):**
```
Task 1: Buat semua tabel database
Task 2: Buat semua query di DataContext
Task 3: Buat semua UI komponen
Task 4: Hubungkan semuanya
```

**Bagus (vertical slicing):**
```
Task 1: User bisa lihat daftar add-on group (schema + context + UI list)
Task 2: User bisa buat add-on group baru (form + mutation + validasi)
Task 3: User bisa attach add-on ke produk (UI produk + query)
Task 4: Add-on muncul saat checkout (POS + cart logic)
```

Setiap slice menghasilkan fungsionalitas yang working dan testable.

### Step 4: Tulis Task
Setiap task mengikuti struktur:

```markdown
## Task [N]: [Judul deskriptif singkat]

**Deskripsi:** Satu paragraf menjelaskan apa yang task ini capai.

**Acceptance criteria:**
- [ ] [Kondisi spesifik dan testable]
- [ ] [Kondisi spesifik dan testable]

**Verifikasi:**
- [ ] Build berhasil: `npm run build`
- [ ] Dev server jalan tanpa error: `npm run dev`
- [ ] Manual check: [deskripsi apa yang diverifikasi]

**Dependencies:** [Nomor task yang harus selesai dulu, atau "None"]

**File yang kemungkinan disentuh:**
- `src/path/ke/file.jsx`
- `scripts/migration.sql`

**Estimasi scope:** [Small: 1-2 file | Medium: 3-5 file | Large: 5+ file]
```

### Step 5: Urutan dan Checkpoint
Atur task sehingga:

1. Dependencies terpenuhi (bangun fondasi dulu)
2. Setiap task meninggalkan sistem dalam state yang working
3. Checkpoint verifikasi setiap 2-3 task
4. Task berisiko tinggi di awal (fail fast)

Tambahkan checkpoint eksplisit:

```markdown
## Checkpoint: Setelah Task 1-3
- [ ] Dev server jalan tanpa error
- [ ] Fitur dasar bisa di-test manual
- [ ] Review dengan user sebelum lanjut
```

## Panduan Ukuran Task

| Size | File | Scope | Contoh KULA POS |
|------|------|-------|-----------------|
| **XS** | 1 | Single function/config | Tambah validasi di form |
| **S** | 1-2 | Satu komponen/query | Tambah kolom di DataContext |
| **M** | 3-5 | Satu feature slice | Flow tambah add-on ke produk |
| **L** | 5-8 | Multi-komponen | Sistem resep FnB lengkap |
| **XL** | 8+ | **Terlalu besar — pecah lagi** | — |

Jika task berukuran L atau lebih besar, HARUS dipecah lagi.

**Kapan pecah task lebih kecil:**
- Butuh lebih dari satu sesi fokus
- Acceptance criteria tidak bisa dijelaskan dalam 3 bullet atau kurang
- Menyentuh 2+ subsystem independen (misal: auth DAN billing)
- Judul task mengandung kata "dan" (tanda itu 2 task)

## Template Plan Document

```markdown
# Implementation Plan: [Nama Fitur/Proyek]

## Overview
[Ringkasan satu paragraf tentang apa yang dibangun]

## Architecture Decisions
- [Keputusan 1 dan alasannya]
- [Keputusan 2 dan alasannya]

## Task List

### Phase 1: Fondasi
- [ ] Task 1: ...
- [ ] Task 2: ...

### Checkpoint: Fondasi
- [ ] Build clean, dev server jalan

### Phase 2: Fitur Inti
- [ ] Task 3: ...
- [ ] Task 4: ...

### Checkpoint: Fitur Inti
- [ ] Flow end-to-end bisa jalan

### Phase 3: Polish
- [ ] Task 5: ...
- [ ] Task 6: ...

### Checkpoint: Selesai
- [ ] Semua acceptance criteria terpenuhi
- [ ] Siap untuk review

## Risiko dan Mitigasi
| Risiko | Impact | Mitigasi |
|--------|--------|----------|
| [Risiko] | [High/Med/Low] | [Strategi] |

## Open Questions
- [Pertanyaan yang butuh input user]
```

## Anti-Rationalization

| Alasan | Realita |
|---|---|
| "Saya tau sambil jalan nanti" | Itu cara dapat kode berantakan dan rework. 10 menit planning hemat berjam-jam. |
| "Task-nya obvious" | Tulis anyway. Task eksplisit memunculkan dependency tersembunyi dan edge case terlupa. |
| "Planning itu overhead" | Planning IS the task. Implementasi tanpa plan itu cuma mengetik. |
| "Saya bisa ingat semua di kepala" | Context window itu terbatas. Written plan survive session boundaries. |
