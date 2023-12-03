import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");

const numbers: any[] = [];

data.forEach((line, y) => {
  const matches = line.matchAll(/[0-9]+/g);
  for (const match of matches) {
    numbers.push({
      y,
      x: match.index,
      number: parseInt(match[0]),
      length: match[0].length,
    });
  }
});

const yMax = data.length - 1;
const xMax = data[0].length - 1;

const allSymbols = data.map((line) => line.split(""));

// console.log({ allSymbols });

numbers.forEach((number) => {
  const y = number.y;
  const coreCells: any[] = [];
  const indexes = [...Array(number.length).keys()].map((i) => i + number.x);
  const allCells = indexes.flatMap((i) => {
    return [
      [y, i],
      [y + 1, i],
      [y - 1, i],
      [y, i + 1],
      [y + 1, i + 1],
      [y - 1, i + 1],
      [y, i - 1],
      [y + 1, i - 1],
      [y - 1, i - 1],
    ];
  });

  allCells.forEach((cell) => {
    const [y, x] = cell;
    if (y < 0 || x < 0 || y > yMax || x > xMax) {
      return;
    }

    if (/[0-9\.]/.test(allSymbols[y][x])) {
      return;
    }
    // console.log(allSymbols[y][x]);
    // Is an engine part
    number.isEnginePart = true;
  });
});

const sum = numbers.reduce((a, c) => {
  if (c.isEnginePart) {
    return a + c.number;
  }

  return a;
}, 0);

console.log({ sum });

// for (var y = 0; y < data.length; y = y + 1) {
//   for (var x = 0; x < data[0].length; x = x + 1) {
//     console.log(data[y][x]);
//   }
// }

// console.log({ data });

logTime("Part 1");

logTime("Part 2");

export {};
