const inputText = await Bun.file(import.meta.resolveSync("./input")).text();

const grid = inputText.split("\n").map((row) => row.split(""));

const gridWidth = grid[0].length;

function isNumber(char: string): boolean {
  return /[0-9]/.test(char);
}

function isSymbol(char: string): boolean {
  return !/[0-9.]/.test(char);
}

function hasSymbols(grid: string[][], row: number, col: number): boolean {
  const above = grid[row - 1];
  const current = grid[row];
  const below = grid[row + 1];

  for (let i = Math.max(0, col - 1); i < gridWidth; i++) {
    if (above && isSymbol(above[i])) return true;
    if (below && isSymbol(below[i])) return true;
    if (!isNumber(current[i])) {
      if (current[i] !== ".") return true;

      if (i > col) break;
    }
  }

  return false;
}

function readPartNumber(row: string[], start: number): number {
  let end;

  for (end = start + 1; end < gridWidth; end++) {
    if (isNumber(row[end])) continue;
  }

  return parseInt(row.slice(start, end).join(""));
}

let sum = 0;

for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
  const row = grid[rowIndex];

  for (let columnIndex = 0; columnIndex < gridWidth; columnIndex++) {
    const char = row[columnIndex];

    if (!isNumber(char)) continue;

    if (hasSymbols(grid, rowIndex, columnIndex)) {
      const partNumber = readPartNumber(row, columnIndex);
      sum += partNumber;
    }

    while (columnIndex < gridWidth && isNumber(row[columnIndex])) columnIndex++;
  }
}

console.log("Answer is ", sum);
