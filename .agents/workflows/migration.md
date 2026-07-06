---
description: Migrasi database Supabase yang aman. Gunakan ketika menambah tabel, kolom, function, atau RLS policy baru ke Supabase.
---

# Migration Workflow — KULA POS

## Kapan Digunakan
- Menambah tabel baru
- Menambah kolom ke tabel existing
- Membuat/mengubah RPC function
- Menambah/mengubah RLS policy
- Mengubah trigger atau constraint

## Prinsip Utama

### 1. Idempotent
Script HARUS bisa dijalankan ulang tanpa error:

```sql
-- ✅ BENAR — idempotent
ALTER TABLE orders ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

CREATE OR REPLACE FUNCTION process_sale(...)
RETURNS ... AS $$
BEGIN
  -- ...
END;
$$ LANGUAGE plpgsql;

-- ❌ SALAH — akan error jika dijalankan ulang
ALTER TABLE orders ADD COLUMN metadata JSONB;
```

### 2. Backward Compatible
Perubahan TIDAK boleh break kode yang sudah di-deploy:

```sql
-- ✅ BENAR — kolom baru dengan DEFAULT, tidak break existing queries
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';

-- ❌ SALAH — rename kolom break semua query yang mereferensi nama lama
ALTER TABLE orders RENAME COLUMN note TO notes;
```

### 3. Rollback Ready
Setiap migration HARUS punya rollback script:

```sql
-- Migration: scripts/20260408_fnb_addons.sql
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';

-- Rollback: scripts/rollback_20260408_fnb_addons.sql
ALTER TABLE order_items DROP COLUMN IF EXISTS metadata;
ALTER TABLE orders DROP COLUMN IF EXISTS notes;
```

## Template Migration Script

```sql
-- ============================================================
-- Migration: [deskripsi singkat]
-- Date: YYYY-MM-DD
-- Author: [nama]
-- Depends on: [migration sebelumnya yang harus sudah jalan, atau "none"]
-- ============================================================

-- 1. Schema Changes
ALTER TABLE [table] ADD COLUMN IF NOT EXISTS [column] [type] DEFAULT [default];

-- 2. RLS Policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = '[policy_name]'
  ) THEN
    CREATE POLICY "[policy_name]" ON [table]
      FOR [SELECT/INSERT/UPDATE/DELETE]
      USING (
        store_id IN (
          SELECT store_id FROM store_staff
          WHERE user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- 3. Functions
CREATE OR REPLACE FUNCTION [function_name](...)
RETURNS ... AS $$
BEGIN
  -- Validate caller access
  IF NOT EXISTS (
    SELECT 1 FROM store_staff 
    WHERE user_id = auth.uid() 
    AND store_id = [p_store_id]
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- ... logic
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Indexes (jika diperlukan)
CREATE INDEX IF NOT EXISTS idx_[table]_[column] ON [table] ([column]);

-- ============================================================
-- VERIFICATION QUERIES (jalankan setelah migration)
-- ============================================================
-- SELECT column_name FROM information_schema.columns WHERE table_name = '[table]';
-- SELECT * FROM pg_policies WHERE tablename = '[table]';
```

## Process

### Step 1: Tulis Migration Script
Simpan di `scripts/YYYYMMDD_[feature_name].sql`

### Step 2: Test di Development
// turbo
```bash
# Copy SQL ke Supabase SQL Editor (development project)
# Jalankan dan pastikan tidak ada error
```

### Step 3: Verify Schema
```sql
-- Cek kolom baru ada
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = '[table_name]'
ORDER BY ordinal_position;

-- Cek RLS policy ada
SELECT * FROM pg_policies WHERE tablename = '[table_name]';

-- Cek function ada
SELECT proname, prosrc FROM pg_proc WHERE proname = '[function_name]';
```

### Step 4: Test dengan Aplikasi
```
1. Jalankan `npm run dev`
2. Test fitur yang bergantung pada migrasi
3. Cek console untuk error query
4. Verify data CRUD lewat UI
```

### Step 5: Consolidate untuk Production
Sebelum deploy ke production, gabungkan semua migration scripts yang pending ke satu master file:

```sql
-- scripts/production_ready_master_vX.X.X.sql
-- Consolidation dari:
--   - scripts/20260408_fnb_addons.sql
--   - scripts/20260409_loyalty_update.sql
-- Tested on: staging environment
-- Date: YYYY-MM-DD
```

## Naming Convention
```
scripts/
├── 20260408_fnb_addons.sql                    ← Individual migration
├── 20260409_loyalty_update.sql                ← Individual migration
├── rollback_20260408_fnb_addons.sql           ← Rollback script
├── production_ready_master_v0.29.1.sql        ← Consolidated for deploy
└── verify_migration.sql                       ← Verification queries
```

## Anti-Rationalization

| Alasan | Realita |
|---|---|
| "Langsung aja ALTER di production" | JANGAN. Tulis script, test di dev/staging dulu, baru jalankan di production. |
| "Rollback script gak perlu" | Anda PASTI butuh suatu saat. Tulis sekarang saat ingat structure-nya. |
| "IF NOT EXISTS terlalu verbose" | 5 karakter extra mencegah deployment error yang bisa down-kan production. |
| "Index nanti aja" | Query lambat di production sulit di-debug. Tambah index saat tabel dibuat. |

## Red Flags
- ALTER TABLE tanpa IF NOT EXISTS / IF EXISTS
- Migration tanpa rollback script
- Jalankan migration langsung di production tanpa test dulu
- DROP TABLE / DROP COLUMN tanpa backup / rollback
- Function tanpa access validation (`auth.uid()` check)
- RLS policy yang terlalu permissive
