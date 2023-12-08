import { parseMap } from "./common";

const { instructions, map } = parseMap();

const instructionsCount = instructions.length;

let starts = Object.keys(map).filter((key) => key.endsWith("A"));

function lcm(numbers: number[]): number {
  function gcd(a: number, b: number): number {
    if (b === 0) {
      return a;
    }
    return gcd(b, a % b);
  }
  return numbers.reduce((a, b) => (a * b) / gcd(a, b));
}

function computeSteps(start: string): number {
  let current = start;
  let steps = 0;

  while (current[2] !== "Z") {
    const nextMove = instructions[steps % instructionsCount] === "L" ? 0 : 1;
    current = map[current][nextMove];
    steps++;
  }

  return steps;
}

const answer = lcm(starts.map(computeSteps));
console.log("Answer is ", answer);
