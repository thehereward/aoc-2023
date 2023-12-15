import { sum } from "../common";
import { assertDefined } from "../common";
import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();
var data = readFile("input");
const instructions = data.flatMap((line) => line.split(","));

function calculateHash(input: string[], currentValue: number = 0): number {
  if (input.length == 0) {
    return currentValue;
  }
  var char = assertDefined(input.shift());

  const code = char.charCodeAt(0);
  currentValue += code;
  currentValue *= 17;
  currentValue %= 256;

  return calculateHash(input, currentValue);
}

const part1 = instructions
  .map((instruction) => calculateHash(instruction.split("")))
  .reduce(sum);
console.log({ part1 });
logTime("Part 1");

type Lens = {
  label: string;
  value: number;
  hash: number;
};

type Instruction = Lens & {
  action: "ADD" | "REMOVE";
};

const lenses = instructions.map<Instruction>((instruction) => {
  const action = instruction.indexOf("=") != -1 ? "ADD" : "REMOVE";
  const [label, value] = instruction.split(action == "ADD" ? "=" : "-");
  return {
    label,
    value: parseInt(value),
    action,
    hash: calculateHash(label.split("")),
  };
});

const NUMBER_OF_BOXES = 256;
const boxes: Lens[][] = new Array(NUMBER_OF_BOXES);
for (var i = 0; i < NUMBER_OF_BOXES; i++) {
  boxes[i] = new Array();
}

lenses.forEach((lens) => {
  const box = boxes[lens.hash];
  const existingLensId = box.findIndex((l) => l.label == lens.label);
  switch (lens.action) {
    case "ADD":
      if (existingLensId == -1) {
        box.push(lens);
      } else {
        box.splice(existingLensId, 1, lens);
      }
      return;
    case "REMOVE":
      if (existingLensId != -1) {
        box.splice(existingLensId, 1);
      }
  }
});

const powers = boxes.flatMap((box, boxNumber) =>
  box.flatMap((lens, lensNumber) => calcPower(lens, boxNumber, lensNumber))
);
console.log({ part2: powers.reduce(sum) });
logTime("Part 2");

export {};

function calcPower(lens: Lens, boxNumber: number, lensNumber: number): number {
  return lens.value * (boxNumber + 1) * (lensNumber + 1);
}
