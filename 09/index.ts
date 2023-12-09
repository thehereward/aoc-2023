import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");
const lines = data.map((line) => line.split(" ").map((c) => parseInt(c)));
// console.log({ lines });

const sequences = lines.map((line) => [line]);

const answers: number[] = [];
sequences.forEach((sequence) => {
  const initialSequence = sequence[0];
  //   console.log(initialSequence);
  let nextSequence = initialSequence;
  let workingSequence = initialSequence;
  while (!nextSequence.every((char) => char == 0)) {
    nextSequence = [];
    for (var i = 1; i < workingSequence.length; i++) {
      const next = workingSequence[i] - workingSequence[i - 1];
      nextSequence.push(next);
    }
    workingSequence = nextSequence;
    // console.log(nextSequence);
    sequence.push(nextSequence);
  }

  //   console.log(sequence);
  let c = 0;
  for (var i = sequence.length - 2; i >= 0; i--) {
    const s = sequence[i];
    const char = s[0];
    c = char - c;
  }
  answers.push(c);
});
// console.log(answers);

console.log(answers.reduce(sum));
logTime("Part 1");

logTime("Part 2");

export {};
