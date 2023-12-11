const inputText = await Bun.file(import.meta.resolveSync("./input")).text();
const lines = inputText.split("\n");

let total = 0;

for (const line of lines) {
  const [_, numbers] = line.split(":").map((t) => t.trim());
  const [winning, drawnNumbers] = numbers.split("|").map((t) =>
    t
      .trim()
      .split(" ")
      .filter((t) => t.length)
  );

  const numOfWinningNums = drawnNumbers.filter((num) =>
    winning.includes(num)
  ).length;

  total += numOfWinningNums ? Math.pow(2, numOfWinningNums - 1) : 0;
}

console.log("Answer is ", total);
