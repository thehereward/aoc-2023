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

type Test = Conditional | Unconditional;

type BaseTest = {
  fn: (_: Part) => boolean;
  ifTrue: string;
};

type Conditional = BaseTest & {
  type: "lessThan" | "moreThan";
  limit: number;
  property: "a" | "m" | "s" | "x";
};

type Unconditional = BaseTest & {
  type: "unconditional";
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
          type: "moreThan",
          limit,
          property,
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
          type: "lessThan",
          limit,
          property,
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
        type: "unconditional",
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

const acceptedPart1: Part[] = [];
const rejectedPart1: Part[] = [];

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
    acceptedPart1.push(part);
  } else {
    rejectedPart1.push(part);
  }
});

// console.log(accepted);

const sums = acceptedPart1.map((part) => {
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

function getPartCopy(key: string): AllPart {
  const part = allParts.get(key);
  if (!part) {
    throw new Error();
  }
  return copyPart(part);
}

const part1 = sums.reduce(sum);
console.log(part1);
logTime("Part 1");

// console.log(instructionLines);

type AllPart = {
  a: number[];
  m: number[];
  s: number[];
  x: number[];
};
const allPart: AllPart = {
  a: [1, 4000],
  m: [1, 4000],
  s: [1, 4000],
  x: [1, 4000],
};

const keys: string[] = ["in"];
const allParts: Map<string, AllPart> = new Map();
allParts.set("in", allPart);

const acceptedPart2: AllPart[] = [];
const rejectedPart2: AllPart[] = [];

while (keys.length > 0) {
  const key = keys.shift();
  if (!key) {
    throw new Error();
  }
  const inst = getInstruction(key);

  const basePart = getPartCopy(key);
  inst.forEach((test) => {
    var part = copyPart(basePart);
    const { ifTrue, type } = test;
    switch (type) {
      case "lessThan":
        part[test.property][1] = test.limit - 1;
        basePart[test.property][0] = test.limit;
        savePart(ifTrue, part);
        break;
      case "moreThan":
        part[test.property][0] = test.limit + 1;
        basePart[test.property][1] = test.limit;
        savePart(ifTrue, part);
        break;
      case "unconditional":
        savePart(ifTrue, part);
    }
  });
}

const ranges = acceptedPart2.map((part) => {
  return (
    (part.a[1] - part.a[0] + 1) *
    (part.m[1] - part.m[0] + 1) *
    (part.s[1] - part.s[0] + 1) *
    (part.x[1] - part.x[0] + 1)
  );
});

console.log(ranges.reduce(sum));
logTime("Part 2");

export {};

function copyPart(part: AllPart): AllPart {
  return JSON.parse(JSON.stringify(part));
}

function savePart(key: string, part: AllPart) {
  switch (key) {
    case "A":
      acceptedPart2.push(part);
      break;
    case "R":
      rejectedPart2.push(part);
      break;
    default:
      if (allParts.has(key)) {
        // Panic
        throw new Error("multiple ways to a test");
      }
      allParts.set(key, part);
      keys.push(key);
  }
}

function assertProperty(value: string): "a" | "m" | "s" | "x" {
  if (!(value == "a" || value == "m" || value == "s" || value == "x"))
    throw new Error();
  return value;
}
