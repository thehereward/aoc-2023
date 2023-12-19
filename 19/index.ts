import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");

var instructionLines: string[] = [];
var partLines: string[] = [];
var finishedInstructions = false;
data.forEach((line) => {
  if (line.length == 0) {
    finishedInstructions = true;
  } else {
    if (finishedInstructions) {
      partLines.push(line);
    } else {
      instructionLines.push(line);
    }
  }
});

type Part = {
  a: number;
  m: number;
  s: number;
  x: number;
};

type Instruction = Test[];

type Test = {
  fn: (_: Part) => boolean;
  ifTrue: string;
};

const instructions: Map<string, Instruction> = new Map();

instructionLines.forEach((line) => {
  const [name, rest] = line.slice(0, line.length - 1).split("{");
  const terms = rest.split(",");
  const tests: Test[] = [];
  terms.forEach((term) => {
    if (term.indexOf(":") != -1) {
      const [test, ifTrue] = term.split(":");
      if (test.indexOf(">") != -1) {
        // greater than
        const [value, limitString] = test.split(">");
        const limit = parseInt(limitString);
        const property = assertProperty(value);
        const fn = (part: Part) => {
          return part[property] > limit;
        };
        tests.push({
          fn,
          ifTrue,
        });
      } else if (test.indexOf("<") != -1) {
        // less than
        const [value, limitString] = test.split("<");
        const limit = parseInt(limitString);
        const property = assertProperty(value);
        const fn = (part: Part) => {
          const result = part[property] < limit;
          //   console.log(part, property, limit, result, ifTrue);
          return result;
        };
        tests.push({
          fn,
          ifTrue,
        });
      } else {
        // panic!
      }
    } else {
      // default
      const fn = (_: Part) => {
        return true;
      };
      tests.push({
        fn,
        ifTrue: term,
      });
    }
  });
  instructions.set(name, tests);
});

// console.log({ instructions });
// console.log(partLines);
const parts = partLines
  .map((line) => {
    const t: any = {};
    line
      .slice(1, line.length - 1)
      .split(",")
      .forEach((term) => {
        const [key, value] = term.split("=");
        const cleanKey = assertProperty(key);
        t[cleanKey] = parseInt(value);
      });
    return t;
  })
  .map((p): Part => p);

const accepted: Part[] = [];
const rejected: Part[] = [];

parts.map((part) => {
  var key = "in";
  var newKey = "in";
  while (!(key == "A" || key == "R")) {
    const inst = getInstruction(key);
    inst.forEach((test) => {
      if (key != newKey) {
        return;
      }
      if (test.fn(part)) {
        newKey = test.ifTrue;
        return;
      }
    });
    key = newKey;
    // console.log(key);
  }

  if (key == "A") {
    accepted.push(part);
  } else {
    rejected.push(part);
  }
});

// console.log(accepted);

const sums = accepted.map((part) => {
  return part.a + part.m + part.s + part.x;
});
// console.log(sums);

function getInstruction(key: string): Instruction {
  const inst = instructions.get(key);
  if (!inst) {
    throw new Error();
  }
  return inst;
}

const part1 = sums.reduce(sum);
console.log(part1);

logTime("Part 1");

logTime("Part 2");

export {};

function assertProperty(value: string): "a" | "m" | "s" | "x" {
  if (!(value == "a" || value == "m" || value == "s" || value == "x"))
    throw new Error();
  return value;
}
