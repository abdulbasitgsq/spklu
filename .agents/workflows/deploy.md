---
description: Checklist deployment ke staging/production. Gunakan sebelum deploy ke Vercel, Firebase, atau environment baru. Wajib dijalankan untuk setiap release.
---

# Deploy Workflow — KULA POS

## Kapan Digunakan
- Deploy fitur baru ke staging
- Deploy ke production
- Migrasi database (SQL scripts ke Supabase)
- Release versi baru

## Pre-Launch Checklist

### Code Quality
- [ ] `npm run build` berhasil tanpa error
- [ ] Tidak ada `console.log` debugging di production code
- [ ] Tidak ada TODO yang harus diselesaikan sebelum launch
- [ ] Error handling menutupi expected failure modes
- [ ] Semua file yang diubah sudah di-review (lihat /review)

### Supabase / Database
- [ ] Migration script sudah disiapkan (`scripts/*.sql`)
- [ ] Migration script idempotent (bisa dijalankan ulang tanpa error)
- [ ] RLS policies benar untuk tabel baru/yang diubah
- [ ] Test query manual di Supabase SQL Editor berhasil
- [ ] Tidak ada breaking change pada kolom existing
- [ ] Rollback script tersedia (DROP yang baru ditambah)

### Multi-Tenant Safety
- [ ] Semua query baru memfilter `store_id`
- [ ] RLS policy memvalidasi `store_id` via `auth.uid()`
- [ ] Tidak ada data leak antar store
- [ ] Store switching di UI tidak menampilkan data stale

### Environment
- [ ] Environment variables yang baru sudah di-set di Vercel/hosting
- [ ] Supabase URL dan Anon Key benar untuk target environment
- [ ] `.env.production` atau `.env.staging` sudah diupdate

### Business Type Compatibility
- [ ] Fitur baru di-gate berdasarkan tipe bisnis yang benar
- [ ] `businessTypes.js` sudah diupdate jika ada fitur baru
- [ ] Fitur tidak muncul di tipe bisnis yang tidak relevan

## Deployment Sequence

```
1. DEPLOY migration SQL ke Supabase
   └── Jalankan script di SQL Editor
   └── Verifikasi tabel/kolom/function ada
   └── Test query manual

2. BUILD production bundle
   └── npm run build
   └── Pastikan tidak ada error/warning critical

3. DEPLOY ke staging dulu
   └── Vercel: push ke branch staging
   └── Test manual flow critical
   └── 1 jam monitoring window

4. DEPLOY ke production
   └── Vercel: merge ke main / push ke production
   └── Verifikasi health (buka app, login, test flow utama)
   └── Cek console untuk error baru

5. POST-DEPLOY monitoring
   └── 1 jam pertama: pantau aktif
   └── Cek Supabase logs untuk error query
   └── Test flow critical: login → POS → transaksi → laporan
```

## Rollback Strategy
Setiap deployment HARUS punya rollback plan sebelum di-deploy:

```markdown
## Rollback Plan: [Fitur/Release]

### Trigger Rollback
- Error rate meningkat signifikan
- User tidak bisa login atau buat transaksi
- Data integrity issue terdeteksi

### Langkah Rollback
1. Vercel: Revert ke previous deployment (satu klik di dashboard)
2. Database: Jalankan rollback SQL script
3. Verify: Cek fitur critical jalan normal

### Database Rollback Script
-- Rollback migration: scripts/rollback_YYYYMMDD_feature.sql
-- Contoh:
ALTER TABLE orders DROP COLUMN IF EXISTS metadata;
ALTER TABLE orders DROP COLUMN IF EXISTS notes;
```

## Post-Launch Verification
Dalam 1 jam pertama setelah deploy:

```
1. ✅ App bisa dibuka tanpa error
2. ✅ Login berhasil (test dengan berbagai role)
3. ✅ POS: bisa tambah item ke keranjang dan checkout
4. ✅ Laporan: data muncul dengan benar
5. ✅ Settings: pengaturan bisa disimpan
6. ✅ Multi-store: switch toko menampilkan data yang benar
7. ✅ Fitur baru: flow end-to-end jalan sesuai spec
```

## CHANGELOG Update
Setiap release HARUS update CHANGELOG.md:

```markdown
## v0.X.X — YYYY-MM-DD

### Added
- [Fitur baru yang ditambahkan]

### Changed
- [Perubahan pada fitur existing]

### Fixed  
- [Bug yang diperbaiki]

### Database Migration
- `scripts/YYYYMMDD_feature.sql` — [Deskripsi migrasi]
```

## Anti-Rationalization

| Alasan | Realita |
|---|---|
| "Di staging jalan, pasti di production juga" | Production punya data, traffic, dan edge case berbeda. Monitor setelah deploy. |
| "Gak perlu rollback plan untuk ini" | Semua fitur butuh kill switch. Bahkan perubahan "simpel" bisa break things. |
| "Deploy hari Jumat sore aja" | JANGAN. Deploy di awal minggu agar bisa monitor dan fix selama jam kerja. |
| "Monitoring nanti aja" | Tambah monitoring SEBELUM launch. Tidak bisa debug apa yang tidak visible. |

## Red Flags
- Deploy tanpa rollback plan
- Big-bang release (semua sekaligus, tanpa staging)
- Tidak ada yang monitor deploy di jam pertama
- Migration SQL belum ditest manual sebelum dijalankan di production
- Deploy hari Jumat sore atau menjelang weekend/libur
