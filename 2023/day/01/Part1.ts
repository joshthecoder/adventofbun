const inputText = await Bun.file(import.meta.resolveSync("./input")).text();
const lines = inputText.split("\n");

let sum = 0;

for (const line of lines) {
  const digits = line
    .split("")
    .map((c) => parseInt(c))
    .filter(Number.isInteger);

  const first = digits[0];
  const last = digits[digits.length - 1];

  sum += first * 10 + last;
}

console.log("Answer is ", sum);
