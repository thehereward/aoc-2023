import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");

interface Number {
  y: number;
  x: number;
  number: number;
  length: number;
  symbols: any[];
  isEnginePart: boolean;
  hasStar: boolean;
}

const numbers: Number[] = [];

data.forEach((line, y) => {
  const matches = line.matchAll(/[0-9]+/g);
  for (const match of matches) {
    numbers.push({
      y,
      x: match.index || 0,
      number: parseInt(match[0]),
      length: match[0].length,
      symbols: [],
      isEnginePart: false,
      hasStar: false,
    });
  }
});

const yMax = data.length - 1;
const xMax = data[0].length - 1;

const allSymbols = data.map((line) => line.split(""));

// console.log({ allSymbols });

const stars: any[] = [];

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

    const symbol = allSymbols[y][x];
    if (/[0-9\.]/.test(symbol)) {
      return;
    }
    // console.log(allSymbols[y][x]);
    // Is an engine part
    number.isEnginePart = true;
    if (number.hasStar) {
      return;
    }
    if (symbol == "*") {
      number.hasStar = symbol == "*";
      number.symbols.push([y, x, symbol]);
      stars.push([y, x, number.number]);
    }
  });
});

console.log(stars);

const sum = numbers.reduce((a, c) => {
  if (c.isEnginePart) {
    return a + c.number;
  }

  return a;
}, 0);

const starSet: Record<string, number[]> = {};

stars.forEach((star) => {
  const [y, x, number] = star;
  const key = `${y}|${x}`;
  if (!starSet[key]) {
    starSet[key] = [];
  }
  starSet[key].push(number);
});

const keys = Object.keys(starSet);
const ratios: number[] = [];
keys.forEach((key) => {
  const numbers = starSet[key];
  if (numbers.length == 2) {
    ratios.push(numbers[0] * numbers[1]);
  }
});
const answer = ratios.reduce((a, c) => a + c);
console.log(answer);

logTime("Part 1");

logTime("Part 2");

export {};
