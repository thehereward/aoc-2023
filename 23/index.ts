import { assertDefined, sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { asKey } from "../common/grid";
import { fromKey } from "../common/grid";
import { toKey, get3By3, getNSEW } from "../common/grid";

const logTime = getTimeLogger();

var data = readFile("input");
const grid = data.map((line) => line.split(""));

const allChars: Map<string, string> = new Map();
grid.forEach((line, y) => {
  line.forEach((char, x) => {
    allChars.set(toKey(x, y), char);
  });
});

const yMax = grid.length;
const xMax = grid[0].length;

const start = [0, 1];
const end = [yMax - 1, xMax - 2];
const endKey = asKey(end);

// console.log({ allChars });

var currentLoc = [1, 1];
var previousLoc = start;
var currentPath = [asKey(previousLoc), asKey(currentLoc)];

const incompletePaths: string[][] = [];
const completePaths: string[][] = [];
while (true) {
  const [y, x] = currentLoc;
  const currentLocKey = asKey(currentLoc);
  if (currentLocKey == endKey) {
    // complete!
    completePaths.push(currentPath);
    if (incompletePaths.length == 0) {
      // we're done
      console.log("We're done");
      break;
    } else {
      currentPath = assertDefined(incompletePaths.shift());
      currentLoc = fromKey(currentPath.slice(-1)[0]);
      continue;
    }
  }
  const locChar = assertDefined(allChars.get(currentLocKey));
  var next: number[][];
  switch (locChar) {
    case ">":
      //   console.log(">");
      //   console.log(currentLocKey);
      next = [[y, x + 1]];
      //   console.log(asKey(next[0]));
      //   console.log(currentPath);
      break;
    case "<":
      next = [[y, x - 1]];
      break;
    case "^":
      next = [[y - 1, x]];
      break;
    case "v":
      next = [[y + 1, x]];
      break;
    default:
      next = getNSEW(x, y);
      break;
  }
  next = next.filter((p) => {
    const key = asKey(p);
    return (
      assertDefined(allChars.get(key)) != "#" && currentPath.indexOf(key) == -1
    );
  });
  if (next.length == 0) {
    // dead end, abandon the path
    if (incompletePaths.length == 0) {
      // we're done
      break;
    } else {
      currentPath = assertDefined(incompletePaths.shift());
      currentLoc = fromKey(currentPath.slice(-1)[0]);
      continue;
    }
  } else if (next.length == 1) {
    currentLoc = next[0];
    currentPath.push(asKey(currentLoc));
  } else {
    // options - split the path
    const nextPaths = next.map((n) => [...currentPath, asKey(n)]);
    incompletePaths.push(...nextPaths);
    currentPath = assertDefined(incompletePaths.shift());
    currentLoc = fromKey(currentPath.slice(-1)[0]);
    continue;
  }
}

console.log(completePaths.map((m) => m.length - 1).sort((a, b) => b - a)[0]);

logTime("Part 1");

var currentLoc = [1, 1];
var previousLoc = start;
var currentPath = [asKey(previousLoc), asKey(currentLoc)];

const incompleteSegments: string[][] = [];
const completeSegments: string[][] = [];

const segmentSet: Set<string> = new Set();

while (true) {
  const [y, x] = currentLoc;

  const currentLocKey = asKey(currentLoc);
  if (currentLocKey == endKey) {
    // complete!
    completeSegments.push(currentPath);
    segmentSet.add(currentPath.slice(0)[0]);
    segmentSet.add(currentPath.slice(1)[0]);
    segmentSet.add(currentPath.slice(-1)[0]);
    segmentSet.add(currentPath.slice(-2)[0]);
    if (incompleteSegments.length == 0) {
      // we're done
      //   console.log("We're done");
      break;
    } else {
      do {
        currentPath = assertDefined(incompleteSegments.shift());
        currentLoc = fromKey(currentPath.slice(-1)[0]);
      } while (
        segmentSet.has(currentPath[0]) &&
        segmentSet.has(currentPath[1]) &&
        incompleteSegments.length > 0
      );
      if (incompleteSegments.length == 0) {
        break;
      }
      continue;
    }
  }

  var next = getNSEW(x, y);

  next = next.filter((p) => {
    const key = asKey(p);
    // console.log(key);

    return (
      assertDefined(allChars.get(key)) != "#" && currentPath.indexOf(key) == -1
    );
  });
  if (next.length == 0) {
    // dead end, abandon the path
    if (incompleteSegments.length == 0) {
      // we're done
      break;
    } else {
      do {
        currentPath = assertDefined(incompleteSegments.shift());
        currentLoc = fromKey(currentPath.slice(-1)[0]);
      } while (
        segmentSet.has(currentPath[0]) &&
        segmentSet.has(currentPath[1]) &&
        incompleteSegments.length > 0
      );
      if (incompleteSegments.length == 0) {
        break;
      }
      continue;
    }
  } else if (next.length == 1) {
    currentLoc = next[0];
    currentPath.push(asKey(currentLoc));
  } else {
    // options - split the path
    completeSegments.push(currentPath);
    segmentSet.add(currentPath.slice(0)[0]);
    segmentSet.add(currentPath.slice(1)[0]);
    segmentSet.add(currentPath.slice(-1)[0]);
    segmentSet.add(currentPath.slice(-2)[0]);
    const nextPaths = next
      .map((n) => asKey(n))
      .filter((k) => !segmentSet.has(k))
      .map((n) => [asKey(currentLoc), n]);
    incompleteSegments.push(...nextPaths);
    do {
      currentPath = assertDefined(incompleteSegments.shift());
      currentLoc = fromKey(currentPath.slice(-1)[0]);
    } while (
      segmentSet.has(currentPath[0]) &&
      segmentSet.has(currentPath[1]) &&
      incompleteSegments.length > 0
    );
    if (incompleteSegments.length == 0) {
      break;
    }
    continue;
  }
}

logTime("Crawled the graph");

const segmentMap = completeSegments
  .map((segment) => {
    return {
      start: segment.slice(0, 1)[0],
      end: segment.slice(-1)[0],
      size: segment.length - 1, // Length included start _and_ end nodes
    };
  })
  .reduce<Map<string, TT[]>>((a, c) => {
    addToAccumulator(a, c.start, c.end, c.size);
    addToAccumulator(a, c.end, c.start, c.size);
    return a;
  }, new Map());

type TT = {
  next: string;
  size: number;
};

const stack = [asKey(start)];
const completedStacks: string[][] = [];
var longestPath = -Infinity;

function dfs(stack: string[], length: number) {
  const currentNode = stack.slice(-1)[0];
  if (currentNode == endKey) {
    // finished
    completedStacks.push(stack);
    longestPath = Math.max(longestPath, length);
    return;
  }

  const nextNodes = assertDefined(segmentMap.get(currentNode));
  nextNodes.forEach((n) => {
    const nextKey = n.next;
    if (stack.indexOf(nextKey) != -1) {
      return;
    } else {
      dfs([...stack, nextKey], length + n.size);
    }
  });
}

dfs(stack, 0);
console.log(longestPath);
logTime("Part 2");

export {};

function addToAccumulator(
  a: Map<string, TT[]>,
  start: string,
  end: string,
  size: number
) {
  if (!a.has(start)) {
    a.set(start, []);
  }
  const b = assertDefined(a.get(start));
  b.push({ next: end, size: size });
}
