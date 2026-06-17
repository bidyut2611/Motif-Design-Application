# Motif Design Application

This repository contains the Motif Design Application, built as a functional prototype using **React**, **Vite**, and **TypeScript**. 

## Features
- **Grid-Based Editor:** A fully interactive 16x16 grid canvas with drawing, erasing, and clearing capabilities. Supports click/tap and drag-to-draw interactions.
- **Color Selection:** Palette including Black, Red, Blue, Green, and Yellow.
- **Live Price Estimation:** Dynamic calculation of pattern cost based on complexity, size, and colors used.
- **Handover PDF Generation:** Generates a high-quality PDF containing the motif preview, order details, and user notes.
- **Motif Library & Saved Designs:** Preloaded traditional patterns and local storage for saving, editing, and duplicating your creations.
- **Premium Aesthetics:** Clean, modern UI styled entirely with Vanilla CSS.

## Setup Instructions

Ensure you have Node.js (v18+) installed.

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Price Estimation Logic

The application calculates the price in real-time using a deterministic algorithm:

`Final Price = Base Price + Color Charge + Complexity Charge + Size Charge`

- **Base Price:** A fixed starting cost of **₹500**.
- **Color Charge:** **₹100** per unique color used in the design.
- **Complexity Charge:** **₹2** per filled cell (denser patterns cost more).
- **Size Charge:** For this iteration, the canvas is fixed at 16x16, so the size charge is **₹0**. If the canvas size increases, an additional formula `(size - 16) * 50` can be applied.

The calculation happens dynamically through a reactive state hook (`useGrid`) that analyzes the grid array.

## Data Structure

The grid canvas state is managed as a **1D Array of Strings** (`string[]`). 
- The array has a fixed length of `size * size` (256 for a 16x16 grid).
- Each element represents a cell and stores a **Hex Color Code** (e.g., `"#3b82f6"`) if colored, or an empty string `""` if blank.
- The 1D array is mapped to a CSS Grid layout natively, ensuring efficient O(1) state updates when rendering without needing complex nested mapping logic.
- When saved, the array and its metadata are serialized to JSON and stored in the browser's `localStorage`.
