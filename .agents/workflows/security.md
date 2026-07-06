---
description: Audit keamanan untuk Supabase multi-tenant. Gunakan sebelum deploy fitur yang melibatkan data sensitif, RLS policy baru, atau endpoint baru.
---

# Security Workflow — KULA POS

## Kapan Digunakan
- Menambah tabel/kolom baru di Supabase
- Membuat atau mengubah RLS policy
- Fitur yang menangani data sensitif (pembayaran, user info)
- Sebelum deploy ke production
- Setelah menambah endpoint atau query baru

## Multi-Tenant Security Checklist

### RLS (Row Level Security)
- [ ] Setiap tabel baru punya RLS enabled
- [ ] Policy memvalidasi `store_id` melalui chain: `auth.uid()` → `store_staff` → `store_id`
- [ ] Tidak ada tabel dengan RLS disabled yang berisi data sensitif
- [ ] Test: user di store A TIDAK bisa lihat data store B

```sql
-- Standard RLS Pattern untuk KULA POS
CREATE POLICY "Users can view own store data" ON new_table
  FOR SELECT USING (
    store_id IN (
      SELECT store_id FROM store_staff 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert to own store" ON new_table
  FOR INSERT WITH CHECK (
    store_id IN (
      SELECT store_id FROM store_staff 
      WHERE user_id = auth.uid()
    )
  );
```

### Data Isolation
- [ ] Query selalu memfilter `store_id`
- [ ] `activeStoreId` dari context, BUKAN dari URL parameter
- [ ] Store switching membersihkan state sebelumnya
- [ ] Tidak ada global query tanpa store filter

```javascript
// ✅ BENAR — filter store_id
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('store_id', activeStoreId);

// ❌ SALAH — tanpa filter, bisa lihat semua store
const { data } = await supabase
  .from('products')
  .select('*');
```

### Authentication & Authorization
- [ ] Semua halaman terproteksi oleh `PrivateRoute`
- [ ] Role-based access di-enforce (owner vs admin vs kasir)
- [ ] `checkPermission()` digunakan untuk fitur yang role-restricted
- [ ] Session expired handling ada dan redirect ke login
- [ ] Tidak ada sensitive data di localStorage (kecuali encrypted)

### Input Validation
- [ ] Form input divalidasi sebelum kirim ke Supabase
- [ ] Numeric input dicek (bukan NaN, bukan negatif untuk harga/stok)
- [ ] String input di-escape/sanitize jika ditampilkan kembali
- [ ] File upload divalidasi (tipe file, ukuran)
- [ ] SQL parameter menggunakan Supabase client (otomatis parameterized)

### Secrets & Environment
- [ ] API keys HANYA di `.env` files (bukan di kode)
- [ ] `.env` files ada di `.gitignore`
- [ ] Supabase anon key (bukan service key) di client-side code
- [ ] Service key HANYA di server-side/edge functions
- [ ] Tidak ada password/token yang di-hardcode

### Console & Logging
- [ ] Tidak ada `console.log` yang print data sensitif
- [ ] Error messages tidak expose internal structure
- [ ] Stack traces tidak di-render ke user

## Supabase Specific Security

### Functions (RPC)
```sql
-- Function HARUS validate caller
CREATE OR REPLACE FUNCTION process_sale(p_store_id UUID, ...)
RETURNS ... AS $$
BEGIN
  -- Validate caller has access to this store
  IF NOT EXISTS (
    SELECT 1 FROM store_staff 
    WHERE user_id = auth.uid() 
    AND store_id = p_store_id
  ) THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  -- ... rest of function
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Storage
- [ ] Bucket policies membatasi akses per store
- [ ] File upload path mengandung `store_id`
- [ ] File types di-restrict (hanya image untuk product photos)

## Security Review Process

### Step 1: Map Attack Surface
```
Untuk setiap fitur baru, identifikasi:
├── Data apa yang diakses/dimodifikasi?
├── Siapa yang boleh mengakses? (role-based)
├── Dari mana data berasal? (user input, API, database)
└── Kemana data pergi? (display, print, export)
```

### Step 2: Check Each Boundary
```
User Input → Validation → Supabase Query → RLS → Data
     │              │              │           │
     ▼              ▼              ▼           ▼
  Sanitize?    Type check?   Parameterized?  Policy?
```

### Step 3: Test Isolation
```
1. Login sebagai user di Store A
2. Coba akses data Store B (via URL manipulation, API call)
3. Verify: request ditolak atau data kosong
4. Switch store via UI
5. Verify: data store lama tidak muncul
```

## Anti-Rationalization

| Alasan | Realita |
|---|---|
| "RLS terlalu ribet, nanti aja" | Tanpa RLS, satu user bisa lihat SEMUA data semua store. Non-negotiable. |
| "Ini internal tool, security gak penting" | Internal tools tetap punya multiple users dan stores. Data harus terisolasi. |
| "Supabase handle security-nya" | Supabase menyediakan tools (RLS), tapi KITA yang harus configure dan test. |
| "Validation di frontend sudah cukup" | Frontend validation bisa di-bypass. Server-side (RLS) adalah line of defense. |

## Red Flags
- Tabel baru tanpa RLS policy
- Query ke Supabase tanpa `store_id` filter
- Service key di client-side code
- `console.log` yang print user data atau tokens
- RLS policy yang terlalu permissive (`USING (true)`)
- Tidak ada role check untuk fitur admin-only
