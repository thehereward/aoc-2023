import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");

const patterns: string[][] = [];

var currentPattern: string[] = [];
data.forEach((line) => {
  if (line.length == 0) {
    patterns.push(currentPattern);
    currentPattern = [];
  } else {
    currentPattern.push(line);
  }
});

// console.log(patterns);

const matchesFromTop = patterns.filter((pattern) =>
  doesItMatchFromTop(pattern)
);

patterns.forEach((p) => p.reverse());

const matchesFromBottom = patterns.filter((pattern) =>
  doesItMatchFromTop(pattern)
);

console.log({ matchesFromTop });

// check for horizontal symmetry
// const rowNumbers = getHorzontalMatches(patterns);
logTime("Row numbers retrieved");

function doesItMatchFromTop(pattern: string[]): boolean {
  console.log(pattern);
  const [lineToMatch, ...rest] = pattern;
  console.log(lineToMatch);

  const matchingIndexes = rest
    .map((line, i) => {
      return {
        isMatch: lineToMatch == line,
        index: i,
      };
    })
    .filter((o) => o.isMatch)
    .map((p) => p.index);

  console.log(matchingIndexes);

  if (matchingIndexes.length == 0) {
    // no matches from this side
    return false;
  }

  matchingIndexes.forEach((index) => {
    if (doesItMatchFromTop(rest.slice(0, index))) {
      return true;
    }
  });
  return false;
}

// console.log(rowNumbers);

function getHorzontalMatches(patterns: string[][]) {
  const horizontalMatches: number[][][] = [];
  patterns.forEach((pattern) => {
    const matches: number[][] = [];
    //   const stopAt = pattern.length / 2;
    pattern.forEach((linea, i) => {
      pattern.forEach((lineb, j) => {
        if (linea == lineb && i != j) {
          matches.push([i, j]);
        }
      });
    });
    //   horizontalMatches.push(matches.slice(0, matches.length / 2));
    horizontalMatches.push(matches);
  });

  const rowNumbers: number[] = [];

  // console.log(patterns);

  patterns.forEach((pattern, i) => {
    // console.log(i);
    const hMatches = horizontalMatches[i];
    const { matches, row } = isAMatch(hMatches, pattern);
    // console.log({ isMatch });
    // console.log(hMatches);

    // if (!isMatch) {
    //   console.log(hMatches);
    // }
    // Might need to add more to this for the real input
    if (matches) {
      rowNumbers.push(row);
    }
  });
  return rowNumbers;
}

function isAMatch(hMatches: number[][], pattern: string[]) {
  const logging = false;
  var row = Infinity;
  if (hMatches.length == 0) {
    return { matches: false, row };
  }

  const sMatches = new Set(hMatches.map((m) => toKey(m[0], m[1])));

  // match from top
  const topMatches = hMatches.filter((m) => m[0] == 0);
  if (logging) {
    console.log({ hMatches, topMatches });
  }
  var matchFromTop = false;
  topMatches.forEach((match) => {
    var t = match[0];
    var b = match[1];
    var isMatch = true;
    while (t < b) {
      if (logging) {
        console.log({ t, b });
      }
      if (!sMatches.has(toKey(b, t))) {
        if (logging) {
          console.log(`not a match, could not find ${b}|${t}`);
        }
        isMatch = false;
        return;
      }
      t++;
      b--;
    }
    if (isMatch) {
      if (logging) {
        console.log("this is a match");
      }
      row = t;
      matchFromTop = true;
    }
  });

  if (matchFromTop) {
    return { matches: true, row };
  }

  // match from bottom
  const buttomMatches = hMatches.filter((m) => m[0] == pattern.length - 1);
  //   console.log({ hMatches, buttomMatches });
  var matchFromBottom = false;
  buttomMatches.forEach((match) => {
    var t = match[0];
    var b = match[1];
    var isMatch = true;
    while (t > b) {
      //   console.log({ t, b });
      if (!sMatches.has(toKey(b, t))) {
        isMatch = false;
        return;
      }
      t--;
      b++;
    }
    if (isMatch) {
      row = b;
      matchFromBottom = true;
    }
  });

  return { matches: matchFromBottom, row };
}

function transpose<T>(array: T[][]): T[][] {
  return array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
}

const s = patterns
  .map((pattern) => pattern.map((line) => line.split("")))
  .map((p) => transpose(p))
  .map((l) => l.map((ll) => ll.join("")));

// const colNumbers = getHorzontalMatches(s);
// logTime("Col numbers retrieved");

// const rowSum = rowNumbers.reduce(sum, 0);
// const colSum = colNumbers.reduce(sum, 0);

// console.log(rowSum * 100 + colSum);

// 42068 is not correct
// 25883 is not correct
// 18499 is not correct
// 35118 is not correct
// 35098 is not correct

logTime("Part 1");

logTime("Part 2");

export {};
