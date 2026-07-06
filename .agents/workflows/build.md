---
description: Implementasi bertahap per-slice. Gunakan ketika mengimplementasi fitur yang menyentuh lebih dari 1 file. Setiap increment harus meninggalkan sistem dalam state yang working.
---

# Build Workflow — KULA POS

## Kapan Digunakan
- Implementasi perubahan multi-file
- Membangun fitur baru dari task breakdown
- Refactoring kode existing
- Menulis lebih dari ~100 baris sebelum testing

## The Increment Cycle

```
┌──────────────────────────────────────┐
│                                      │
│   Implement ──→ Test ──→ Verify ──┐  │
│       ▲                           │  │
│       └───── Next slice ◄─────────┘  │
│                                      │
└──────────────────────────────────────┘
```

Untuk setiap slice:
1. **Implement** — fungsionalitas terkecil yang complete
2. **Test** — jalankan dev server, cek console errors
3. **Verify** — konfirmasi slice berfungsi (dev server jalan, no errors, manual check)
4. **Lanjut** ke slice berikutnya

## Rules

### Rule 0: Simplicity First
Sebelum menulis kode, tanya: "Apa cara paling simpel yang bisa jalan?"

```
SIMPLICITY CHECK:
✗ Generic EventBus untuk satu notifikasi → ✓ Function call biasa
✗ Abstract factory untuk 2 komponen mirip → ✓ 2 komponen + shared utils
✗ Config-driven form builder untuk 3 form → ✓ 3 form components
```

### Rule 0.5: Scope Discipline
Sentuh HANYA yang task butuhkan.

JANGAN:
- "Clean up" kode di sekitar perubahan Anda
- Refactor import di file yang tidak dimodifikasi
- Hapus comment yang tidak sepenuhnya dipahami
- Tambah fitur yang tidak ada di spec karena "kayaknya berguna"
- Modernisasi syntax di file yang cuma dibaca

Jika menemukan sesuatu di luar scope:
```
NOTICED BUT NOT TOUCHING:
- src/utils/format.js ada unused import (unrelated)
- Sidebar.jsx bisa dioptimasi re-render (separate task)
→ Mau saya buatkan task terpisah untuk ini?
```

### Rule 1: One Thing at a Time
Setiap increment mengubah satu hal logis. Jangan campur concern.

**Buruk:** Satu perubahan yang tambah komponen baru, refactor yang existing, dan update config.
**Bagus:** Tiga perubahan terpisah — satu untuk masing-masing.

### Rule 2: Keep It Working
Setiap increment, project harus bisa build dan dev server jalan. Jangan tinggalkan codebase dalam state broken.

// turbo
Verifikasi setiap slice:
```bash
npm run dev  # Pastikan dev server jalan tanpa error
```

### Rule 3: Safe Defaults
Kode baru harus default ke behavior yang aman dan konservatif:

```javascript
// Safe: disabled by default, opt-in
export function processOrder(data, options = {}) {
  const shouldPrint = options.printReceipt ?? false;
  // ...
}
```

### Rule 4: Rollback-Friendly
Setiap increment harus bisa di-revert secara independen:
- Penambahan (file/fungsi baru) mudah di-revert
- Modifikasi kode existing harus minimal dan fokus
- Migrasi database harus punya rollback script

## KULA POS Specific Patterns

### Pattern: Tambah Fitur Berdasarkan Business Type
```javascript
// 1. Cek businessTypes.js untuk config
// 2. Gunakan useBusinessType() hook
// 3. Conditional render berdasarkan hasFeature()

const { hasFeature } = useBusinessType();

{hasFeature('kitchen_display') && (
  <KitchenDisplayLink />
)}
```

### Pattern: Data Flow untuk Fitur Baru
```
1. Schema → scripts/migration.sql
2. Query → src/context/DataContext.jsx  
3. Hook → src/hooks/useNewFeature.js (jika complex)
4. UI → src/pages/NewFeaturePage.jsx
5. Config → src/config/businessTypes.js (jika business-type-specific)
```

### Pattern: Multi-Tenant Safety
```javascript
// SELALU filter berdasarkan store_id
const { data } = await supabase
  .from('products')
  .select('*')
  .eq('store_id', activeStoreId);  // ← WAJIB

// JANGAN pernah query tanpa store_id filter
```

## Increment Checklist
Setelah setiap increment:
- [ ] Perubahan melakukan satu hal dan complete
- [ ] Dev server jalan tanpa error baru di console
- [ ] Build berhasil (jika diperlukan): `npm run build`
- [ ] Fungsionalitas baru berjalan sesuai harapan
- [ ] Tidak ada file di luar scope yang disentuh

## Anti-Rationalization

| Alasan | Realita |
|---|---|
| "Nanti test-nya sekaligus di akhir" | Bug menumpuk. Bug di slice 1 membuat slice 2-5 salah. Test setiap slice. |
| "Lebih cepat kalau sekaligus" | TERASA lebih cepat sampai ada error dan gak bisa temukan dari 500 baris mana penyebabnya. |
| "Refactor kecil ini bisa sekalian" | Refactor dicampur fitur buat keduanya lebih sulit di-review dan debug. Pisahkan. |
| "Saya tinggal tambahin ini juga" | Scope creep. STOP. Tulis task terpisah. |

## Red Flags
- Lebih dari 100 baris kode ditulis tanpa cek dev server
- Multiple perubahan unrelated dalam satu increment
- Skip test/verify step untuk gerak lebih cepat
- Build atau dev server broken di antara increment
- Perubahan besar yang belum di-verify menumpuk
