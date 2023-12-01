import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");

const lines = data.map((line) => line.split("").filter((c) => parseInt(c)));

const values = lines.map((line) => {
  return line[0] + line.slice(-1);
});

const r = values.map((value) => parseInt(value));

const result = r.reduce((a, c) => {
  return a + c;
});

logTime("Part 1");

console.log({ result });

logTime("Part 2");

export {};
