import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");
const lines = data.map((line) => line.split(" ").map((c) => parseInt(c)));

const sequences = lines.map((line) => [line]);

const part1: number[] = [];
const part2: number[] = [];
sequences.forEach((sequence) => {
  const initialSequence = sequence[0];
  let nextSequence = initialSequence;
  let workingSequence = initialSequence;
  while (!nextSequence.every((char) => char == 0)) {
    nextSequence = [];
    for (var i = 1; i < workingSequence.length; i++) {
      const next = workingSequence[i] - workingSequence[i - 1];
      nextSequence.push(next);
    }
    workingSequence = nextSequence;
    sequence.push(nextSequence);
  }

  let diffPart1 = 0;
  let diffPart2 = 0;
  for (var i = sequence.length - 2; i >= 0; i--) {
    diffPart1 = sequence[i].slice(-1)[0] + diffPart1;
    diffPart2 = sequence[i][0] - diffPart2;
  }
  part1.push(diffPart1);
  part2.push(diffPart2);
});

console.log(part1.reduce(sum));
logTime("Part 1");

console.log(part2.reduce(sum));
logTime("Part 2");

export {};
