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

// Manual inspection tells us these modules must pulse high at the same time to make rx pulse low
const mustPulseHigh = ["pg", "sp", "qs", "sv"];
const pulsedHighOn: number[] = [];

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

resetModules();

type Pulse = {
  source: string;
  destination: string;
  value: boolean;
};

function resetModules() {
  modules.forEach((module) => {
    module.output = false;
    module.destinations.forEach((destination) => {
      const destMod = moduleMap.get(destination);
      if (!destMod) {
        unfoundSet.add(destination);
        return;
      }
      destMod.inputs.set(module.name, false);
    });
  });
}

function sendPulse(pulse: Pulse): Pulse[] {
  const { source, destination, value } = pulse;
  const module = moduleMap.get(destination);
  if (!module) {
    unfoundSet.add(destination);
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
while (count > 0) {
  const { lowPulseCount, highPulseCount } = pressButton();

  stateAfterPressingButton.push({
    lowPulseCount,
    highPulseCount,
  });

  count--;
}

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

console.log(part1.highPulseCount * part1.lowPulseCount);

logTime("Part 1");

resetModules();

var count = 0;
while (true) {
  const { gfPulsedHigh } = pressButton();
  count++;

  if (gfPulsedHigh) {
    pulsedHighOn.push(count);
  }

  if (pulsedHighOn.length == mustPulseHigh.length) {
    break;
  }
}
console.log(pulsedHighOn.reduce((a, b) => a * b));
logTime("Part 2");

// cycle time
// nv --> 4052 // 4051
// jq --> 3920 // 3919
// jp --> 3762 // 3761
// bx --> 3908 // 3907
// lcm : 7297580117520
// 7297580117519 is too low
// 7297580117520 is too low
// 14595160235039 is too low
// 233283622908263 is correct

export {};
function pressButton() {
  var gfPulsedHigh = false;
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

    if (
      pulse.value == true &&
      mustPulseHigh.findIndex((must) => must == pulse.source) != -1
    ) {
      gfPulsedHigh = true;
    }

    const newPulses = sendPulse(pulse);
    pulses.push(...newPulses);
  }

  const anyOutputsHigh = modules.reduce((a, c) => {
    return c.output || a;
  }, false);
  return { anyOutputsHigh, lowPulseCount, highPulseCount, gfPulsedHigh };
}
