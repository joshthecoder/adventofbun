/*
  A solution using Bun sqlite and some simple SQL!
*/

import { Database } from "bun:sqlite";

const inputText = await Bun.file(import.meta.resolveSync("./input")).text();
const lines = inputText.split("\n");

type GameDrawing = {
  red: number;
  green: number;
  blue: number;
};

type GameRecord = {
  gameId: number;
  draws: GameDrawing[];
};

// Some ugly ass parsing code. Don't judge me I was in a hurry and didn't feel like using regex.
function parseGameRecord(line: string): GameRecord {
  const [header, body] = line.split(":");
  const gameId = parseInt(header.split(" ")[1]);

  const draws = body.split(";").map((drawText) => {
    return drawText.split(",").reduce<GameDrawing>(
      (record, cubes) => {
        const [count, color] = cubes.trim().split(" ") as [
          string,
          "red" | "green" | "blue"
        ];
        return { ...record, [color]: record[color] + parseInt(count) };
      },
      { red: 0, green: 0, blue: 0 }
    );
  });

  return {
    gameId,
    draws,
  };
}

const records = lines.map(parseGameRecord);

const db = new Database();

// Each row represents one drawing of cubes in a game.
db.run(`
	CREATE TABLE game_records(
		recordId INTEGER PRIMARY KEY AUTOINCREMENT,
		gameId INTEGER NOT NULL,
		subsetIndex INTEGER NOT NULL,
		redCubes INTEGER NOT NULL,
		greenCubes INTEGER NOT NULL,
		blueCubes INTEGER NOT NULL,

		UNIQUE(gameId, subsetIndex)
	)
`);

const insertQuery = db.query(`
	INSERT INTO game_records (gameId, subsetIndex, redCubes, greenCubes, blueCubes)
	VALUES ($gameId, $subset, $reds, $greens, $blues);
`);

for (const record of records) {
  record.draws.forEach((draw, index) => {
    insertQuery.run({
      $gameId: record.gameId,
      $subset: index,
      $reds: draw.red,
      $greens: draw.green,
      $blues: draw.blue,
    });
  });
}

const part1Results = db
  .query<{ gameId: number }, []>(
    `
		SELECT gameId
		FROM game_records
		GROUP BY gameId
		HAVING
			MAX(redCubes) <= 12 AND
			MAX(greenCubes) <= 13 AND
			MAX(blueCubes) <= 14
	`
  )
  .all();

console.log(
  "Part 1 Answer is ",
  part1Results.reduce((sum, result) => sum + result.gameId, 0)
);

const part2Result = db
  .query<{ total: number }, []>(
    `
    SELECT SUM(power) as total
    FROM (
      SELECT
        MAX(redCubes) * MAX(greenCubes) * MAX(blueCubes) as power
      FROM game_records
      GROUP BY gameId
    )
`
  )
  .get();

console.log("Part 2 Answer is ", part2Result?.total);

db.close();
