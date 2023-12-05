const inputText = await Bun.file(import.meta.resolveSync("./input")).text();
const lines = inputText.split("\n");

const digitTokens = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  None: null,
} as const;

type TokenKey = keyof typeof digitTokens;

const tokenNames = Object.keys(digitTokens) as TokenKey[];

function parseLine(line: string): number {
  const first = tokenNames.reduce<{ pos: number; token: TokenKey }>(
    (result, token) => {
      const index = line.indexOf(token);
      if (index !== -1 && index <= result.pos) {
        return { pos: index, token };
      }
      return result;
    },
    { pos: Infinity, token: "None" }
  );

  if (first.token === "None")
    throw new Error("No first digit found for line: " + line);

  const remainingLine = line.slice(first.pos + first.token.length);

  const last = tokenNames.reduce<{ pos: number; token: TokenKey }>(
    (result, token) => {
      const index = remainingLine.lastIndexOf(token);
      if (index !== -1 && index >= result.pos) {
        return { pos: index, token };
      }
      return result;
    },
    { pos: 0, token: "None" }
  );

  if (last.token === "None")
    return digitTokens[first.token] * 10 + digitTokens[first.token];

  return digitTokens[first.token] * 10 + digitTokens[last.token];
}

let sum = 0;

for (const line of lines) {
  sum += parseLine(line);
}

console.log("Answer is ", sum);
