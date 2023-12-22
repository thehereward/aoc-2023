import { assertDefined, sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data: any[] = readFile("input");
data = data.map((line) => line.split("~"));
const blocks: number[][][] = data.map((line) =>
  line.map((l: string) => l.split(",").map((c) => parseInt(c)))
);
blocks.sort((a, b) => a[0][2] - b[0][2]);

blocks.forEach((block) => {
  const [start, end] = block;
  if (start[0] > end[0]) throw new Error();
  if (start[1] > end[1]) throw new Error();
  if (start[2] > end[2]) throw new Error();
});

var xMin = Infinity;
var xMax = -Infinity;
var yMin = Infinity;
var yMax = -Infinity;
var zMin = Infinity;
var zMax = -Infinity;

blocks.forEach((block) => {
  const [start, end] = block;
  xMin = Math.min(start[0], end[0], xMin);
  xMax = Math.max(start[0], end[0], xMax);
  yMin = Math.min(start[1], end[1], yMin);
  yMax = Math.max(start[1], end[1], yMax);
  zMin = Math.min(start[2], end[2], zMin);
  zMax = Math.max(start[2], end[2], zMax);
});

const ground = [
  [xMin, yMin, 0],
  [xMax, yMax, 0],
];

function cubesIntersect(a: number[][], b: number[][]): boolean {
  //   Determining overlap in the x plane
  const overlapX = a[1][0] >= b[0][0] && a[0][0] <= b[1][0];
  //   Determining overlap in the y plane
  const overlapY = a[1][1] >= b[0][1] && a[0][1] <= b[1][1];
  //   Determining overlap in the z plane
  const overlapZ = a[1][2] >= b[0][2] && a[0][2] <= b[1][2];

  //   console.log(a, b);
  //   console.log({ overlapX, overlapY, overlapZ });
  return overlapX && overlapY && overlapZ;
}

function cubesSupported(a: number[][], b: number[][]): boolean {
  //   Determining overlap in the x plane
  const overlapX = a[1][0] >= b[0][0] && a[0][0] <= b[1][0];
  //   Determining overlap in the y plane
  const overlapY = a[1][1] >= b[0][1] && a[0][1] <= b[1][1];
  //   Determining just above in the z plane
  const overlapZ = a[0][2] == b[1][2] + 1 || b[0][2] == a[1][2] + 1;

  //   console.log(a, b);
  //   console.log({ overlapX, overlapY, overlapZ });
  return overlapX && overlapY && overlapZ;
}

const settledCubes = [ground];
const supportingCubes: number[][][][] = [];
const mapBlocksToSupporters: Map<string, Set<string>> = new Map();
mapBlocksToSupporters.set(JSON.stringify(ground), new Set());

blocks.forEach((block) => {
  var supporting = settledCubes.filter((a) => cubesSupported(block, a));
  var isSettled = supporting.length > 0;
  while (!isSettled) {
    block = block.map((a) => [a[0], a[1], a[2] - 1]);
    supporting = settledCubes.filter((a) => cubesSupported(block, a));
    isSettled = supporting.length > 0;
  }
  supportingCubes.push(supporting);
  const key = JSON.stringify(block);
  if (!mapBlocksToSupporters.has(key)) {
    mapBlocksToSupporters.set(key, new Set());
  }
  const e = assertDefined(mapBlocksToSupporters.get(key));
  supporting.map((m) => JSON.stringify(m)).forEach((a) => e.add(a));
  settledCubes.push(block);
});

// settledCubes.shift(); // Remove ground

function onlyUnique(value: any, index: any, array: string | any[]) {
  return array.indexOf(value) === index;
}

const supportingCubeStrings = supportingCubes
  //   .filter((c) => c !== ground)
  .map((s) => s.map((c) => JSON.stringify(c)));
//   .filter(onlyUnique).length;

const essentialCubes = supportingCubeStrings
  .filter((s) => s.length == 1)
  .map((s) => s[0])
  .filter(onlyUnique);

console.log(settledCubes.length - essentialCubes.length);
// console.log(xMin, xMax, yMin, yMax, zMin, zMax);
logTime("Part 1");

// console.log(
//   supportingCubeStrings.filter((s) => s.length == 1).map((s) => s[0])
// );
// console.log(supportingCubeStrings);

const mapBlocksToSupported: Map<string, Set<string>> = new Map();
mapBlocksToSupporters.forEach((value, key) => {
  value.forEach((value) => {
    if (!mapBlocksToSupported.has(value)) {
      mapBlocksToSupported.set(value, new Set());
    }
    const t = assertDefined(mapBlocksToSupported.get(value));
    t.add(key);
  });
});

// A list of blocks that will fall if _just_ the key block is removed
const mapBlocksToBlocksThatWouldFall: Map<string, Set<string>> = new Map();
const mapBlocksToAllBlocksAbove: Map<string, Set<string>> = new Map();

const finishedBlocks: string[] = [];
settledCubes
  .map((c) => JSON.stringify(c))
  .forEach((s) => {
    if (!mapBlocksToSupported.has(s)) {
      mapBlocksToBlocksThatWouldFall.set(s, new Set([s]));
      mapBlocksToAllBlocksAbove.set(s, new Set([s]));
      finishedBlocks.push(s);
    }
  });

const blocksToProcess = finishedBlocks.flatMap((block) => [
  ...assertDefined(mapBlocksToSupporters.get(block)),
]);

// console.log({ blocksToProcess });

var count = 1;
while (blocksToProcess.length > 0) {
  if (count % 1000 == 0) {
    logTime(`Blocks to process: ${blocksToProcess.length}`);
  }
  count++;
  const nextBlock = assertDefined(blocksToProcess.shift());
  //   console.log({ nextBlock });
  const supported = assertDefined(mapBlocksToSupported.get(nextBlock));
  const supportedWithTheirSupported = getSetFromMap(
    supported,
    mapBlocksToAllBlocksAbove
  );
  const canProcess = supportedWithTheirSupported.size == supported.size;
  if (!canProcess) {
    // One of the blocks this block supports hasn't been processed yet
    // Put this block to the back of the queue
    // console.log(nextBlock);
    blocksToProcess.push(nextBlock);
    continue;
  }
  //   console.log({ supportedWithTheirSupported });

  // Get all the blocks directly or indirectly supported by the block we're disintergrating
  const allBlocksAbove: Set<string> = new Set();
  supportedWithTheirSupported.forEach((value, key) => {
    allBlocksAbove.add(key);
    value.forEach((v) => {
      allBlocksAbove.add(v);
    });
  });
  allBlocksAbove.add(nextBlock);
  //   console.log({ allBlocksAbove });

  // Get all the blocks directly supported that would fall if we disintegrate the block
  const wouldFall: Set<string> = new Set([nextBlock]);
  const supportedWithSupporters = getSetFromMap(
    supported,
    mapBlocksToSupporters
  );
  supportedWithSupporters.forEach((value, key) => {
    if (Array.from(value).every((v) => wouldFall.has(v))) {
      wouldFall.add(key);
    }
  });

  // Get all the blocks we already know would fall if the block were disintegrated
  getSetFromMap(wouldFall, mapBlocksToBlocksThatWouldFall).forEach((value) => {
    value.forEach((v) => {
      wouldFall.add(v);
    });
  });
  //   console.log({ wouldFall });

  // Get the blocks that are supported but have not yet fallen
  const notFallenYet: Set<string> = new Set();
  allBlocksAbove.forEach((block) => {
    if (!wouldFall.has(block)) {
      notFallenYet.add(block);
    }
  });

  //   console.log({ notFallenYet });

  // Check if the block would fall now
  var wasChange = false;
  do {
    wasChange = false;
    notFallenYet.forEach((block) => {
      //   console.log({ wouldFall });
      //   console.log({ notFallenYet });
      const supporters = assertDefined(mapBlocksToSupporters.get(block));
      //   console.log({ block, supporters });
      if (
        Array.from(supporters).every((supporter) => wouldFall.has(supporter))
      ) {
        if (!wouldFall.has(block)) {
          wouldFall.add(block);
          notFallenYet.delete(block);
          wasChange = true;
          //   console.log("would fall");
        }
      }
    });
  } while (wasChange);

  // Repeat to check if there's another case we need to handle
  notFallenYet.forEach((block) => {
    const supporters = assertDefined(mapBlocksToSupporters.get(block));
    if (Array.from(supporters).every((supporter) => wouldFall.has(supporter))) {
      throw new Error();
    }
  });
  //   console.log("");
  //   console.log({ allBlocksAbove, notFallenYet, wouldFall });
  mapBlocksToBlocksThatWouldFall.set(nextBlock, wouldFall);
  mapBlocksToAllBlocksAbove.set(nextBlock, allBlocksAbove);

  const supporters = assertDefined(mapBlocksToSupporters.get(nextBlock));
  supporters.forEach((s) => {
    if (blocksToProcess.indexOf(s) == -1) blocksToProcess.push(s);
  });
}

mapBlocksToBlocksThatWouldFall.delete(JSON.stringify(ground));

const part2 = Array.from(mapBlocksToBlocksThatWouldFall.values())
  .map((value) => value.size - 1)
  .reduce(sum);

console.log(part2);

// console.log(decided);
// console.log(mapBlocksToBlocksThatWouldFall);
// console.log(mapBlocksToSupported);
// console.log(mapBlocksToSupporters);

logTime("Part 2");

export {};
function allBlocksAboveKnown(supported: Set<string>) {
  var canProcess = true;
  supported.forEach(
    (value) => (canProcess = canProcess && mapBlocksToAllBlocksAbove.has(value))
  );
  return canProcess;
}

function getSetFromMap<T, U>(set: Set<T>, map: Map<T, U>): Map<T, U> {
  const i: Map<T, U> = new Map();
  set.forEach((key) => {
    if (map.has(key)) {
      const v = assertDefined(map.get(key));
      i.set(key, v);
    }
  });
  return i;
}

function intersection<T>(a: Set<T>, b: Set<T>): Set<T> {
  const smallest = a.size < b.size ? a : b;
  const largest = smallest == a ? b : a;
  const i: Set<T> = new Set();
  smallest.forEach((value) => {
    if (largest.has(value)) i.add(value);
  });
  return i;
}
