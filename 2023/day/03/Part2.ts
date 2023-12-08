type Coord = {
  row: number;
  col: number;
};

const inputText = await Bun.file(import.meta.resolveSync("./input")).text();

const grid = inputText.split("\n").map((row) => row.split(""));

const gridWidth = grid[0].length;

function isNumber(char: string): boolean {
  return /[0-9]/.test(char);
}

function isSymbol(char: string): boolean {
  return !/[0-9.]/.test(char);
}

function getAdjSymbols(
  grid: string[][],
  row: number,
  col: number
): { hasSymbols: boolean; gears: Coord[] } {
  const above = grid[row - 1];
  const current = grid[row];
  const below = grid[row + 1];

  let hasSymbols = false;
  const gears = [];

  for (let i = Math.max(0, col - 1); i < gridWidth; i++) {
    if (above && isSymbol(above[i])) {
      hasSymbols = true;
      if (above[i] === "*") gears.push({ row: row - 1, col: i });
    }
    if (below && isSymbol(below[i])) {
      hasSymbols = true;
      if (below[i] === "*") gears.push({ row: row + 1, col: i });
    }
    if (!isNumber(current[i])) {
      if (current[i] !== ".") {
        hasSymbols = true;
        gears.push({ row, col: i });
      }

      if (i > col) break;
    }
  }

  return { hasSymbols, gears };
}

function readPartNumber(row: string[], start: number): number {
  let end;

  for (end = start + 1; end < gridWidth; end++) {
    if (isNumber(row[end])) continue;
  }

  return parseInt(row.slice(start, end).join(""));
}

let sum = 0;

const gearsByCoord: { [key: string]: number[] } = {};

for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
  const row = grid[rowIndex];

  for (let columnIndex = 0; columnIndex < gridWidth; columnIndex++) {
    const char = row[columnIndex];

    if (!isNumber(char)) continue;

    const { hasSymbols, gears } = getAdjSymbols(grid, rowIndex, columnIndex);

    if (hasSymbols) {
      const partNumber = readPartNumber(row, columnIndex);
      sum += partNumber;

      gears.forEach(({ row, col }) => {
        const gearPartNumbers = gearsByCoord[`${row},${col}`] || [];
        gearPartNumbers.push(partNumber);
        gearsByCoord[`${row},${col}`] = gearPartNumbers;
      });
    }

    while (columnIndex < gridWidth && isNumber(row[columnIndex])) columnIndex++;
  }
}

const sumOfGearRatios = Object.values(gearsByCoord)
  .filter((partNumbers) => partNumbers.length === 2)
  .reduce((sum, partNumbers) => {
    return sum + partNumbers[0] * partNumbers[1];
  }, 0);

console.log("Answer is ", sumOfGearRatios);
