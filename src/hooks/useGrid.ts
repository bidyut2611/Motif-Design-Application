import { useState, useCallback } from 'react';

export type Tool = 'draw' | 'erase';
export type Color = '#000000' | '#ef4444' | '#3b82f6' | '#10b981' | '#eab308';

export const COLORS: { id: string; hex: Color; label: string }[] = [
  { id: 'black', hex: '#000000', label: 'Black' },
  { id: 'red', hex: '#ef4444', label: 'Red' },
  { id: 'blue', hex: '#3b82f6', label: 'Blue' },
  { id: 'green', hex: '#10b981', label: 'Green' },
  { id: 'yellow', hex: '#eab308', label: 'Yellow' },
];

export function useGrid(initialSize = 16) {
  const [size] = useState(initialSize);
  const [grid, setGrid] = useState<string[]>(Array(size * size).fill(''));
  const [activeTool, setActiveTool] = useState<Tool>('draw');
  const [activeColor, setActiveColor] = useState<Color>(COLORS[0].hex);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleCellAction = useCallback((index: number) => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      if (activeTool === 'draw') {
        newGrid[index] = activeColor;
      } else if (activeTool === 'erase') {
        newGrid[index] = '';
      }
      return newGrid;
    });
  }, [activeTool, activeColor]);

  const onMouseDown = useCallback((index: number) => {
    setIsDrawing(true);
    handleCellAction(index);
  }, [handleCellAction]);

  const onMouseEnter = useCallback((index: number) => {
    if (isDrawing) {
      handleCellAction(index);
    }
  }, [isDrawing, handleCellAction]);

  const onMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    setGrid(Array(size * size).fill(''));
  }, [size]);

  const loadGrid = useCallback((newGrid: string[]) => {
    if (newGrid.length === size * size) {
      setGrid([...newGrid]);
    }
  }, [size]);

  return {
    size,
    grid,
    activeTool,
    setActiveTool,
    activeColor,
    setActiveColor,
    isDrawing,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
    clearCanvas,
    loadGrid
  };
}
