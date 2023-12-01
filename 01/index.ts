import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");

data = data
  .map((d) => d.replace(/one/g, "one1one"))
  .map((d) => d.replace(/two/g, "two2two"))
  .map((d) => d.replace(/three/g, "three3three"))
  .map((d) => d.replace(/four/g, "four4four"))
  .map((d) => d.replace(/five/g, "five5five"))
  .map((d) => d.replace(/six/g, "six6six"))
  .map((d) => d.replace(/seven/g, "seven7seven"))
  .map((d) => d.replace(/eight/g, "eight8eight"))
  .map((d) => d.replace(/nine/g, "nine9nine"));

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
