import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

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

const stars: any[] = [];

numbers.forEach((number) => {
  const y = number.y;
  const indexes = get0To(number.length).map((i) => i + number.x);
  const allCells = indexes.flatMap((i) => get3By3(i, y));

  allCells.forEach((cell) => {
    const [y, x] = cell;
    if (y < 0 || x < 0 || y > yMax || x > xMax) {
      return;
    }

    const symbol = allSymbols[y][x];
    if (/[0-9\.]/.test(symbol)) {
      return;
    }

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

const part1 = numbers
  .filter((n) => n.isEnginePart)
  .map((n) => n.number)
  .reduce(sum);

logTime("Part 1");
console.log(part1);

const starSet: Record<string, number[]> = {};

stars.forEach((star) => {
  const [y, x, number] = star;
  const key = toKey(x, y);
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
const answer = ratios.reduce(sum);

logTime("Part 2");
console.log(answer);

export {};
