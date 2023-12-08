import { parseMap } from "./common";

const { instructions, map } = parseMap();

let currentLoc = "AAA";
let i;

let steps = 0;

while (currentLoc !== "ZZZ") {
  for (i = 0; i < instructions.length; i++, steps++) {
    if (currentLoc === "ZZZ") break;
    const nextTurn = instructions[i];
    const [left, right] = map[currentLoc];
    if (nextTurn === "L") currentLoc = left;
    else currentLoc = right;
  }
}

console.log("Answer is ", steps);
