const inputText = await Bun.file(import.meta.resolveSync("./input")).text();
const lines = inputText.split("\n");

const [instructions, empty, ...mapText] = lines;

export function parseMap() {
  const map = mapText.reduce<{ [key: string]: string[] }>((m, line) => {
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

  return {
    instructions,
    map,
  };
}
