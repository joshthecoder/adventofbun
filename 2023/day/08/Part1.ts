const inputText = await Bun.file(import.meta.resolveSync("./input")).text();
const lines = inputText.split("\n");

const [instructions, empty, ...map] = lines;

const mapIndex = map.reduce<{ [key: string]: string[] }>((m, line) => {
  const [key, destPair] = line.split("=").map((part) => part.trim());
  const [left, right] = destPair
    .replace("(", "")
    .replace(")", "")
    .split(",")
    .map((part) => part.trim());

  return {
    ...m,
    [key]: [left, right],
  };
}, {});

let currentLoc = "AAA";
let i;

let steps = 0;

while (currentLoc !== "ZZZ") {
  for (i = 0; i < instructions.length; i++, steps++) {
    if (currentLoc === "ZZZ") break;
    const nextTurn = instructions[i];
    const [left, right] = mapIndex[currentLoc];
    if (nextTurn === "L") currentLoc = left;
    else currentLoc = right;
  }
}

console.log("Answer is ", steps);
