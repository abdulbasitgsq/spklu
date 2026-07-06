---
description: Debugging sistematis dengan structured triage. Gunakan ketika test gagal, build error, behavior tidak sesuai harapan, atau muncul error di console/runtime.
---

# Debug Workflow — KULA POS

## Kapan Digunakan
- Error di console browser (ReferenceError, TypeError, dll)
- Build error saat `npm run build`
- Behavior tidak sesuai harapan (UI salah, data tidak muncul)
- Error di Supabase (RLS denied, query gagal)
- Sesuatu yang tadinya jalan, sekarang tidak

## The Stop-the-Line Rule
Ketika sesuatu unexpected terjadi:

```
1. STOP menambah fitur atau membuat perubahan
2. PRESERVE evidence (error output, console log, screenshot)
3. DIAGNOSE menggunakan triage checklist
4. FIX root cause
5. GUARD agar tidak terulang
6. RESUME hanya setelah verifikasi lolos
```

**Jangan lewati error untuk lanjut ke fitur berikutnya.** Error menumpuk.

## Triage Checklist

### Step 1: Reproduce
Buat failure terjadi secara reliabel.

```
Bisa reproduce failure-nya?
├── YA → Lanjut ke Step 2
└── TIDAK
    ├── Kumpulkan context lebih (log, environment)
    ├── Coba reproduce di minimal environment
    └── Jika benar-benar non-reproducible, dokumentasikan dan monitor
```

### Step 2: Localize
Persempit DI MANA failure terjadi:

```
Layer mana yang gagal?
├── UI/Frontend     → Cek browser console, DOM, network tab
├── Context/State   → Cek DataContext, useState, useEffect
├── Supabase Query  → Cek query, RLS policy, kolom yang diminta
├── Build/Config    → Cek vite.config, package.json, imports
├── Business Logic  → Cek hooks (useBusinessType, usePOS)
└── External        → Cek Supabase status, API key, CORS
```

### KULA POS Specific Triage

```
ReferenceError: X is not defined
├── Apakah variable/function di-import?
├── Apakah destructuring dari hook sudah benar?
│   └── Contoh: useBusinessType() → perlu { config } bukan hanya { hasFeature }
└── Apakah typo di nama variable?

TypeError: Cannot read property 'X' of undefined
├── Data dari Supabase belum selesai loading?
│   └── Tambahkan conditional: if (!data) return <Loading />
├── currentStore belum ter-set?
│   └── Cek apakah DataContext sudah resolve store selection
└── Object shape tidak sesuai harapan?
    └── Console.log data dari Supabase untuk cek structure

Supabase RLS Error (permission denied)
├── Apakah RLS policy ada untuk tabel ini?
├── Apakah user authenticated?
├── Apakah store_id filter benar?
└── Cek di Supabase Dashboard → SQL Editor → test query manual

UI Layout/Styling Issue (padding, spacing, alignment)
├── Apakah ada wrapper yang menambah padding ganda?
│   └── Cek Layout.jsx, SettingsLayout.jsx
├── Apakah className conflict dengan parent?
├── Apakah responsive classes (sm:, lg:) menyebabkan perbedaan?
└── Inspect element di browser → Computed tab
```

### Step 3: Reduce
Buat minimal failing case:
- Hapus kode/config unrelated sampai hanya bug yang tersisa
- Sederhanakan input ke contoh terkecil yang trigger failure
- Isolasi komponen yang bermasalah

### Step 4: Fix Root Cause
Fix penyebab sebenarnya, BUKAN gejala:

```
Gejala: "Padding di halaman pengaturan terlalu besar"

Fix gejala (buruk):
  → Ubah p-4 jadi p-2 di semua settings pages

Fix root cause (bagus):
  → SettingsLayout.jsx menambah padding wrapper (lg:p-6) 
  → DI ATAS padding halaman individual (p-4)
  → = Double padding
  → Hapus padding di wrapper, biarkan halaman yang kontrol
```

Tanya: "KENAPA ini terjadi?" sampai menemukan penyebab sebenarnya.

### Step 5: Guard Against Recurrence
Setelah fix:
- Pastikan pattern yang sama tidak ada di tempat lain
- Jika pattern salah ditemukan di banyak tempat, fix semuanya
- Tambahkan comment jika logic-nya non-obvious

### Step 6: Verify End-to-End
Setelah fix, verifikasi scenario lengkap:

// turbo
```bash
# Pastikan dev server jalan
npm run dev

# Cek di browser — buka halaman yang bermasalah
# Cek console — tidak ada error baru
# Cek halaman lain yang mungkin terpengaruh
```

## Safe Fallback Patterns

```javascript
// Safe default + warning (bukan crash)
function getStoreConfig(key) {
  const value = currentStore?.settings?.[key];
  if (value === undefined) {
    console.warn(`Missing store config: ${key}, using default`);
    return DEFAULTS[key] ?? null;
  }
  return value;
}

// Graceful degradation (bukan broken feature)
function renderChart(data) {
  if (!data || data.length === 0) {
    return <EmptyState message="Belum ada data untuk periode ini" />;
  }
  try {
    return <Chart data={data} />;
  } catch (error) {
    console.error('Chart render failed:', error);
    return <ErrorState message="Gagal menampilkan grafik" />;
  }
}
```

## Anti-Rationalization

| Alasan | Realita |
|---|---|
| "Saya tau bug-nya apa, langsung fix aja" | Mungkin benar 70% waktu. 30% sisanya buang jam kerja. Reproduce dulu. |
| "Test-nya yang salah kali" | Verifikasi asumsi itu. Kalau test salah, fix test-nya. Jangan skip. |
| "Di local saya jalan kok" | Environment berbeda. Cek browser version, data state, auth state. |
| "Fix-nya di commit berikutnya aja" | Fix sekarang. Commit berikutnya akan introduce bug baru di atas ini. |

## Red Flags
- Skip failing error untuk lanjut kerja fitur baru
- Guess fix tanpa reproduce bug dulu
- Fix gejala bukan root cause
- "Sudah jalan sekarang" tanpa paham apa yang berubah
- Multiple perubahan unrelated saat debugging (contaminate fix)
