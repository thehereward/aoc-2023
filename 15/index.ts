import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");
const instructions = data.flatMap((line) => line.split(","));
// console.log({ instructions });

function calculateHash(input: string[], currentValue: number = 0): number {
  if (input.length == 0) {
    return currentValue;
  }
  const char = input.shift();
  if (char == undefined) {
    throw new Error();
  }

  const code = char.charCodeAt(0);
  currentValue += code;
  currentValue *= 17;
  currentValue %= 256;

  return calculateHash(input, currentValue);
}

const hashes = instructions.map((int) => calculateHash(int.split(""), 0));
// console.log(hashes);

// console.log(`HASH produces 52 = ${calculateHash("HASH".split(""))}`);
// console.log(`HASH produces 30 = ${calculateHash("rn=1".split(""))}`);
// console.log(`HASH produces 231 = ${calculateHash("ot=7".split(""))}`);

const part1 = hashes.reduce(sum);
console.log({ part1 });
logTime("Part 1");

logTime("Part 2");

export {};
