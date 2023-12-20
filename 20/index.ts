import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

const FlipFlopPrefix = "%";
const ConjunctionPrefix = "&";

const unfoundSet: Set<string> = new Set();

var data = readFile("input");
type ModuleType = "FlipFlop" | "Conjunction" | "broadcaster";
type Module = {
  type: ModuleType;
  name: string;
  destinations: string[];
  output: boolean;
  inputs: Map<string, boolean>;
};
const modules: Module[] = data
  .map((line) => line.split(" -> "))
  .map((line) => {
    const [source, destString] = line;
    const destinations = destString.split(",").map((s) => s.trim());
    var type: ModuleType;
    var name: string = "";
    switch (source[0]) {
      case FlipFlopPrefix:
        type = "FlipFlop";
        name = source.slice(1);
        break;
      case ConjunctionPrefix:
        type = "Conjunction";
        name = source.slice(1);
        break;
      default:
        type = "broadcaster";
        name = "broadcaster";
    }
    return {
      name,
      type,
      destinations,
      output: false,
      inputs: new Map(),
    };
  });

const moduleMap: Map<string, Module> = new Map();
modules.forEach((module) => moduleMap.set(module.name, module));

// Initialise all inputs - mainly for conjunctions
modules.forEach((module) => {
  module.destinations.forEach((destination) => {
    const destMod = moduleMap.get(destination);
    if (!destMod) {
      unfoundSet.add(destination);
      return;
    }
    destMod.inputs.set(module.name, false);
  });
});

// console.log(moduleMap);

type Pulse = {
  source: string;
  destination: string;
  value: boolean;
};

function sendPulse(pulse: Pulse): Pulse[] {
  const { source, destination, value } = pulse;
  const module = moduleMap.get(destination);
  if (!module) {
    unfoundSet.add(destination);
    // logTime(`Pulse ${value} sent to ${destination}`);
    return [];
  }
  switch (module.type) {
    case "FlipFlop":
      if (value) {
        return [];
      } else {
        module.output = !module.output;
        return module.destinations.map((destination) => {
          return {
            source: module.name,
            destination,
            value: module.output,
          };
        });
      }
    case "Conjunction":
      module.inputs.set(source, value);
      var allInputsTrue = true;
      module.inputs.forEach(
        (value) => (allInputsTrue = allInputsTrue && value)
      );
      return module.destinations.map((destination) => {
        return {
          source: module.name,
          destination,
          value: !allInputsTrue,
        };
      });
    case "broadcaster":
      return module.destinations.map((destination) => {
        return {
          source: module.name,
          destination,
          value,
        };
      });
  }
}

const stateAfterPressingButton: {
  lowPulseCount: number;
  highPulseCount: number;
}[] = [];
var count = 1000;
var rxCount = 0;
var part2 = Infinity;
var hasPrinted = false;
while (count > 0) {
  const { lowPulseCount, highPulseCount } = pressButton();

  stateAfterPressingButton.push({
    lowPulseCount,
    highPulseCount,
  });

  count--;
}

// console.log(modules);
// console.log(stateAfterPressingButton);
const part1 = stateAfterPressingButton.reduce(
  (a, c) => {
    return {
      lowPulseCount: a.lowPulseCount + c.lowPulseCount,
      highPulseCount: a.highPulseCount + c.highPulseCount,
    };
  },
  {
    lowPulseCount: 0,
    highPulseCount: 0,
  }
);
console.log(unfoundSet);
console.log(part1.highPulseCount * part1.lowPulseCount);

logTime("Part 1");

modules.forEach((module) => {
  module.destinations.forEach((destination) => {
    const destMod = moduleMap.get(destination);
    if (!destMod) {
      unfoundSet.add(destination);
      return;
    }
    destMod.inputs.set(module.name, false);
  });
});

var rxSentSignal = false;
var numberOfPresses = 0;
var gfOutCounts: number[][];
var lastGfOutCount = 0;

while (!rxSentSignal) {
  pressButton();
  numberOfPresses++;
  if (rxCount == 1) {
    break;
  }
  // if (numberOfPresses % 1000 == 0) {
  //   logTime(numberOfPresses.toString());
  // }

  // modules.forEach((m) => console.log(m.name, m.output));
  // break;

  const gf = moduleMap.get("gf");
  if (!gf) {
    throw new Error();
  }

  var gfOutCount = 0;
  gf.inputs.forEach((i) => {
    if (i) {
      gfOutCount++;
    }
    if (gfOutCount != lastGfOutCount) {
      gfOutCounts.push([numberOfPresses, gfOutCount]);
      lastGfOutCount = gfOutCount;
      console.log(numberOfPresses, gfOutCount);
    }
  });

  // if (!gf.output) {
  //   console.log(numberOfPresses);
  //   console.log(gf);
  //   break;
  // }
  // Day 17 Part 2 brute-force took 83227400ms
}

console.log(numberOfPresses);
logTime("Part 2");

export {};
function pressButton() {
  const pulses: Pulse[] = [];

  pulses.push({
    source: "button",
    destination: "broadcaster",
    value: false,
  });

  var highPulseCount = 0;
  var lowPulseCount = 0;

  while (pulses.length > 0) {
    const pulse = pulses.shift();
    if (!pulse) {
      throw new Error();
    }
    if (pulse.value) {
      highPulseCount++;
    } else {
      lowPulseCount++;
    }

    if (pulse.value == false && pulse.destination == "rx") {
      rxCount++;
    }
    const newPulses = sendPulse(pulse);
    pulses.push(...newPulses);
  }

  const anyOutputsHigh = modules.reduce((a, c) => {
    return c.output || a;
  }, false);
  return { anyOutputsHigh, lowPulseCount, highPulseCount };
}
