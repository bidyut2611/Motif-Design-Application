# Motif Design Application

A grid-based motif design application for handloom pattern creation, built with **React**, **Vite**, and **TypeScript**.

---

## Features

| Question | Feature | Status |
|----------|---------|--------|
| Q1 | Grid-Based Motif Editor (16×16, tap/drag/erase/clear) | ✅ |
| Q2 | Color Selection & Editing Tools (5 colors, Draw/Erase/Clear) | ✅ |
| Q3 | Home Screen & Navigation | ✅ |
| Q4 | Live Price Estimation | ✅ |
| Q5 | Order Handover PDF | ✅ |
| Q6 | Motif Library (3 presets, load/edit/save) | ✅ |
| Q7 | Saved Designs (save/open/duplicate/delete) | ✅ |
| Q8 | Share Design (export image/data/PDF) | ✅ |

---

## Setup Instructions

**Prerequisites:** Node.js v18+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

To build for production:
```bash
npm run build
```

---

## Price Estimation Logic

The price is calculated **live** as the user designs on the canvas using the following deterministic formula:

```
Final Price = Base Price + Color Charge + Complexity Charge + Size Charge
```

| Component | Calculation | Example |
|-----------|-------------|---------|
| **Base Price** | Fixed ₹500 | ₹500 |
| **Color Charge** | ₹100 × number of unique colors used | 3 colors → ₹300 |
| **Complexity Charge** | ₹2 × number of filled cells | 80 cells → ₹160 |
| **Size Charge** | ₹50 × (size − 16) if size > 16, else ₹0 | 16×16 → ₹0 |

**Key rules from the assignment:**
- A design using **more colors** costs more → Color Charge scales linearly.
- A **denser/more intricate** pattern costs more → Complexity Charge scales with filled cells.
- A **larger motif** costs more → Size Charge activates above 16×16.

The formula is implemented in [`src/utils/pricing.ts`](src/utils/pricing.ts).

---

## Data Structure — Grid Canvas

The grid state is represented as a **flat 1D array of strings** (`string[]`):

```typescript
const grid: string[] = Array(size * size).fill('');
// For 16×16: an array of 256 elements
```

| Aspect | Detail |
|--------|--------|
| **Length** | `size × size` (256 for 16×16) |
| **Cell value** | Hex color string (e.g., `"#ef4444"`) if filled, empty string `""` if blank |
| **Indexing** | `index = row * size + col` — row-major order |
| **Rendering** | Mapped directly to CSS Grid with `grid-template-columns: repeat(16, 1fr)` |
| **Persistence** | Serialized as JSON and stored in `localStorage` |

**Why 1D instead of 2D?**
- O(1) access by index.
- Simpler state updates (spread `[...grid]` + single index assignment).
- Direct mapping to CSS Grid layout without nested iteration.
- Efficient JSON serialization for local storage and export.

The grid hook is implemented in [`src/hooks/useGrid.ts`](src/hooks/useGrid.ts).

---

## User Flow

```
Home Screen
├── Create New Design → Grid Editor → Draw/Erase/Clear → Color Selection
│                                   → Live Price Estimation
│                                   → Generate Handover PDF
│                                   → Share (Image / JSON / PDF)
│                                   → Save Design
├── Saved Designs → Open / Duplicate / Delete
└── Motif Library → Select Preset → Edit → Save as New Design
```

---

## Tech Stack

- **React 19** — UI library
- **Vite 8** — Build tool & dev server
- **TypeScript** — Type safety
- **React Router** — Client-side routing
- **html2canvas** — Canvas-to-image conversion for PDF/PNG export
- **jsPDF** — PDF generation
- **Lucide React** — Icon library
- **Vanilla CSS** — All styling (no CSS frameworks)
