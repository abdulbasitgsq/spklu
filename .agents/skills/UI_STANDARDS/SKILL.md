---
name: UI_STANDARDS
description: Strict design and implementation standards for KULA POS to ensure consistency and premium aesthetics.
---

# UI Standards - KULA POS

This skill documents the "Source of Truth" for UI development in KULA POS. Before building any new page or component, Antigravity MUST refer to these standards to ensure consistency and avoid generic "AI-style" layouts.

## 1. Core Principles
- **No Placeholders**: Never use `generate_image` or generic text for UI structure. Build with real code and components.
- **Consistency over Speed**: It is better to take longer to match the existing design system than to push a non-standard UI.
- **Component Reusability**: Always check `src/components/ui` for existing primitives before creating new ones.

## 2. Layout & Spacing Standards
- **Page Container**: Main containers MUST use `p-6` (24px) padding. On mobile, use `p-4 sm:p-6`.
- **Vertical Rhythm**: Use `space-y-6` between major sections (Headers, InfoCards, Tables).
- **Cards**:
    - Use `<Card className="rounded-xl border-none shadow-sm overflow-hidden">`.
    - `CardHeader` should have `className="pb-3 border-b bg-white"`.
    - `CardContent` should follow the header with appropriate padding.

## 3. Typography & Badges
- **Upper-Labels**: For metadata and secondary info, use:
  ```jsx
  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">LABEL</p>
  ```
- **Page Titles**: Use `text-2xl font-bold text-slate-900 tracking-tight`.
- **Badges**: Use the standard `Badge` component. For status and categories, use curated HSL colors (blue-50/blue-600, orange-50/orange-600) rather than standard tailwind reds/blues.

## 4. Key Component Usage

### InfoCard
- **Locale**: Always use `id-ID` for currency formatting.
- **Props**: Use the `isCurrency={true}` prop for automated Rupiah formatting.
- **Icons**: Pass the **Component Reference** (e.g., `icon={DollarSign}`), NOT an element (e.g., `icon={<DollarSign />}`).
- **Variants**: Use `variant="primary|success|warning|danger|info|purple|pink"`.

### Sidebar Navigation
- **Redundancy**: Never add top-level icons for features already categorized under "Databases" or "Settings".
- **Path Matching**: Ensure active states match exactly to avoid double-selection.

## 5. Currency & Numbers
- **Formatting**: Use `Number(val).toLocaleString('id-ID')`.
- **Prefix**: Always use `Rp ` (with space) for currency.

## 6. Business Type Gating
- **Hook**: Always use `useBusinessType()` or `checkFeatureAccess`.
- **Context**: Ensure features for Pharmacy (e.g., Defecta) don't show up for FnB, and vice-versa.

## 8. Data Mapping Conventions
To avoid "undefined" property bugs when dealing with database fields, always follow these naming and mapping rules:

- **Database / RPC**: Use `snake_case` (e.g., `loyalty_points`, `total_spent`).
- **Frontend / State**: Use `camelCase` (e.g., `loyaltyPoints`, `totalSpent`).
- **Mapping at the Edge**:
    - Data MUST be mapped from `snake_case` to `camelCase` at the earliest point (usually in `DataContext.jsx` mappers).
    - **Standard Mapper Example**:
      ```javascript
      const mapCustomer = (data) => ({
          ...data,
          loyaltyPoints: data.loyalty_points ?? data.loyaltyPoints ?? 0,
          totalSpent: data.total_spent ?? data.totalSpent ?? 0,
          storeName: data.store_name ?? data.storeName
      });
      ```
- **Robust Access**: When writing logic that might receive unmapped data (from search results or legacy objects), use the fallback pattern: `const val = data.loyaltyPoints ?? data.loyalty_points ?? 0;`.

---

## 9. Internal Review
