import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

var data = readFile("input");

console.log({ data });

logTime("Part 1");

logTime("Part 2");

export {};
