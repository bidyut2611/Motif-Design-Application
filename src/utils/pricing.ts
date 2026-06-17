export interface PricingDetails {
  basePrice: number;
  colorCharge: number;
  complexityCharge: number;
  sizeCharge: number;
  total: number;
  uniqueColors: number;
  filledCells: number;
}

export function calculatePrice(grid: string[], size: number): PricingDetails {
  const filledCells = grid.filter((cell) => cell !== '');
  const uniqueColors = new Set(filledCells).size;
  
  const basePrice = 500;
  const colorCharge = uniqueColors * 100;
  const complexityCharge = filledCells.length * 2;
  const sizeCharge = size > 16 ? (size - 16) * 50 : 0; // Baseline 16x16
  
  const total = basePrice + colorCharge + complexityCharge + sizeCharge;
  
  return {
    basePrice,
    colorCharge,
    complexityCharge,
    sizeCharge,
    total,
    uniqueColors,
    filledCells: filledCells.length
  };
}
