import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");
const instructions = data.flatMap((line) => line.split(","));

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

const part1 = hashes.reduce(sum);
console.log({ part1 });
logTime("Part 1");

type Instruction = {
  label: string;
  value: number;
  action: "ADD" | "REMOVE";
  hash: number;
};

const lenses = instructions.map<Instruction>((instruction) => {
  if (instruction.indexOf("=") != -1) {
    // have an addition
    const [label, value] = instruction.split("=");
    return {
      label,
      value: parseInt(value),
      action: "ADD",
      hash: calculateHash(label.split("")),
    };
  } else if (instruction.indexOf("-") != -1) {
    // have a removal
    const [label, value] = instruction.split("-");

    return {
      label,
      value: parseInt(value),
      action: "REMOVE",
      hash: calculateHash(label.split("")),
    };
  } else {
    throw new Error();
  }
});

const length = 256;
const boxes: Instruction[][] = new Array(length);
for (var i = 0; i < length; i++) {
  boxes[i] = new Array();
}

lenses.forEach((lens) => {
  const box = boxes[lens.hash];
  const existingLensId = box.findIndex((l) => l.label == lens.label);
  if (lens.action == "ADD") {
    if (existingLensId == -1) {
      box.push(lens);
    } else {
      box.splice(existingLensId, 1, lens);
    }
  } else {
    if (existingLensId != -1) {
      box.splice(existingLensId, 1);
    }
  }
});

const powers = boxes.flatMap((box, i) => {
  const boxPower = i + 1;
  return box.flatMap(
    (lens, lensPower) => lens.value * (lensPower + 1) * boxPower
  );
});
console.log({ part2: powers.reduce(sum) });
logTime("Part 2");

export {};
