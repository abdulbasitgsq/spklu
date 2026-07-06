---
description: Review kode multi-dimensi sebelum merge. Gunakan setelah implementasi fitur selesai, sebelum deploy, atau saat mengevaluasi perubahan besar.
---

# Review Workflow — KULA POS

## Kapan Digunakan
- Setelah menyelesaikan implementasi fitur
- Sebelum deploy ke staging/production
- Setelah bug fix (review fix DAN regression guard)
- Saat mengevaluasi perubahan yang menyentuh > 5 file

## The Five-Axis Review
Setiap review mengevaluasi kode di 5 dimensi:

### 1. Correctness — Apakah kode melakukan apa yang diklaim?
- [ ] Sesuai dengan spec/task requirements?
- [ ] Edge cases ditangani (null, empty, boundary)?
- [ ] Error paths ditangani (bukan hanya happy path)?
- [ ] Tidak ada off-by-one errors atau state inconsistencies?

**KULA POS specific:**
- [ ] Data di-filter berdasarkan `store_id`? (multi-tenant safety)
- [ ] `useBusinessType()` dipakai dengan benar?
- [ ] Destructuring dari hooks sudah lengkap?

### 2. Readability & Simplicity — Bisa dipahami tanpa penjelasan?
- [ ] Nama variable/function deskriptif dan konsisten?
- [ ] Control flow straightforward (hindari nested ternary)?
- [ ] Tidak ada "clever" tricks yang bisa disederhanakan?
- [ ] **Bisa dilakukan dengan lebih sedikit baris?**
- [ ] Abstraksi sepadan dengan kompleksitasnya?

### 3. Architecture — Apakah perubahan cocok dengan desain sistem?
- [ ] Mengikuti pattern existing atau introduce yang baru (justified)?
- [ ] Boundaries modul tetap clean?
- [ ] Tidak ada code duplication yang seharusnya di-share?
- [ ] Dependency flow benar (tidak ada circular dependency)?

**KULA POS specific:**
- [ ] Data flow: UI → Context → Supabase (bukan langsung query dari komponen)?
- [ ] Business logic di hook/context, bukan di komponen UI?
- [ ] Config tipe bisnis di `businessTypes.js`, bukan hardcoded?

### 4. Security  
- [ ] User input divalidasi?
- [ ] Tidak ada secrets di kode atau version control?
- [ ] Supabase RLS policy yang tepat?
- [ ] Query menggunakan parameter (bukan string concatenation)?
- [ ] Tidak ada data sensitif di console.log?

### 5. Performance
- [ ] Tidak ada N+1 query pattern?
- [ ] Tidak ada loop unbounded atau fetching data tanpa limit?
- [ ] Tidak ada unnecessary re-renders di UI komponen?
- [ ] Pagination ada di list yang bisa besar?
- [ ] Image/asset dioptimasi?

## Change Sizing Guidelines

```
~100 baris berubah  → Bagus. Reviewable dalam satu sesi.
~300 baris berubah  → Acceptable jika satu perubahan logis.
~1000 baris berubah → Terlalu besar. Pecah.
```

## Review Findings — Severity Labels

| Prefix | Arti | Aksi |
|--------|------|------|
| *(tanpa prefix)* | Harus diperbaiki | Wajib sebelum merge |
| **Critical:** | Block merge | Keamanan, data loss, broken functionality |
| **Nit:** | Minor, opsional | Boleh diabaikan — formatting, style preference |
| **Optional:** | Saran | Worth considering tapi tidak wajib |
| **FYI** | Informational | Tidak perlu aksi — context untuk masa depan |

## Review Process

### Step 1: Understand Context
```
- Apa yang perubahan ini coba capai?
- Spec/task mana yang diimplementasikan?
- Apa expected behavior change?
```

### Step 2: Review Implementation
Walk through kode dengan 5 axis di pikiran:

```
Untuk setiap file yang berubah:
1. Correctness: Apakah kode ini benar?
2. Readability: Bisa saya pahami tanpa bantuan?
3. Architecture: Cocok dengan sistem?
4. Security: Ada vulnerability?
5. Performance: Ada bottleneck?
```

### Step 3: Verify the Verification
```
- Dev server jalan tanpa error?
- Manual test sudah dilakukan?
- Screenshot untuk UI changes?
- Before/after comparison?
```

## Dead Code Hygiene
Setelah refactoring, cek orphaned code:

```
DEAD CODE IDENTIFIED:
- oldFormatDate() di src/utils/ — diganti formatDate()
- LegacyCartPanel di src/components/ — diganti CartPanel
→ Aman untuk dihapus?
```

## Dependency Discipline
Sebelum menambah dependency baru:
1. Apakah stack existing bisa solve ini?
2. Seberapa besar dependency-nya? (bundle impact)
3. Actively maintained? (last commit, open issues)
4. Known vulnerabilities? (`npm audit`)
5. License compatible?

**Rule:** Prefer standard library dan existing utils daripada dependency baru.

## Anti-Rationalization

| Alasan | Realita |
|---|---|
| "Kodenya jalan, sudah cukup" | Kode yang jalan tapi unreadable, insecure, atau arsitektur salah menciptakan debt. |
| "Saya yang nulis, pasti benar" | Author blind terhadap asumsi sendiri. Semua perubahan butuh review. |
| "Nanti aja bersih-bersihnya" | Nanti tidak pernah datang. Review adalah quality gate — gunakan. |
| "Kode AI pasti fine" | Kode AI butuh MORE scrutiny, bukan less. AI confident dan plausible, bahkan saat salah. |
| "Test lolos, berarti bagus" | Test necessary tapi not sufficient. Tidak menangkap masalah arsitektur, security, readability. |
