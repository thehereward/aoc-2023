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

const horizontals: string[][] = JSON.parse(JSON.stringify(patterns));
var verticals: string[][] = JSON.parse(JSON.stringify(patterns));
verticals = verticals
  .map((pattern) => pattern.map((line) => line.split("")))
  .map((p) => transpose(p))
  .map((l) => l.map((ll) => ll.join("")));

// Horizontal Matches
logTime("Processing from top");
const matchesFromTop = horizontals
  .map((pattern) => getMatchCandidates(pattern))
  .map((candidates) => candidates.map((candidate) => isMatch(candidate, 1)))
  .map((candidates) => candidates.filter((candidate) => candidate.matches));

horizontals.forEach((p) => p.reverse());

logTime("Processing from bottom");
var matchesFromBottom = horizontals
  .map((pattern) => getMatchCandidates(pattern))
  .map((candidates) => candidates.map((candidate) => isMatch(candidate, 1)))
  .map((candidates) => candidates.filter((candidate) => candidate.matches));

const hLengths = horizontals.map((h) => h.length);

matchesFromBottom = matchesFromBottom.map((match, i) => {
  if (match.length == 0) {
    return [];
  }
  if (match.length > 1) {
    // console.log(match);
    console.log("there were multiple reflection points - from bottom");
  }
  //   console.log(match);
  const m = match[0];
  return [
    {
      matches: m.matches,
      rowsAbove: hLengths[i] - m.rowsAbove,
    },
  ];
});

// console.log(matchesFromBottom);

// Vertical Matches
logTime("Processing from left");
const matchesFromLeft = verticals
  .map((pattern) => getMatchCandidates(pattern))
  .map((candidates) => candidates.map((candidate) => isMatch(candidate, 1)))
  .map((candidates) => candidates.filter((candidate) => candidate.matches));

verticals.forEach((p) => p.reverse());

logTime("Processing from right");
var matchesFromRight = verticals
  .map((pattern) => getMatchCandidates(pattern))
  .map((candidates) => candidates.map((candidate) => isMatch(candidate, 1)))
  .map((candidates) => candidates.filter((candidate) => candidate.matches));

const vLengths = verticals.map((v) => v.length);

matchesFromRight = matchesFromRight.map((match, i) => {
  if (match.length == 0) {
    return [];
  }
  if (match.length > 1) {
    // console.log(match);
    console.log("there were multiple reflection points - from right");
  }
  const m = match[0];
  return [
    {
      matches: m.matches,
      rowsAbove: vLengths[i] - m.rowsAbove,
    },
  ];
});

// console.log(matchesFromRight);

const hMatches = [matchesFromBottom, matchesFromTop].flat().flat();

const vMatches = [matchesFromLeft, matchesFromRight].flat().flat();

patterns.forEach((_, i) => {
  const match = [
    matchesFromTop[i],
    matchesFromBottom[i],
    matchesFromLeft[i],
    matchesFromRight[i],
  ].flat();
  if (match.length != 1) {
    ("error");
  }
});
// console.log(hMatches);
// console.log(vMatches);

const hSum = hMatches.map((h) => h.rowsAbove).reduce(sum, 0);
const vSum = vMatches.map((v) => v.rowsAbove).reduce(sum, 0);

console.log(hSum * 100 + vSum);

// console.log(matchesFromBottom);
// console.log(matchesFromLeft);
// console.log(matchesFromRight);

function isMatch(pattern: string[], rowsAbove: number) {
  if (pattern.length == 0) {
    return { matches: true, rowsAbove };
  }
  if (pattern.length == 1) {
    console.log("there was a reflection in the middle of a line");
    console.log(pattern);
    return { matches: true, rowsAbove };
  }
  const [first, ...tail] = pattern;
  const [last, ...rest] = tail.reverse();
  if (first != last) {
    return { matches: false, rowsAbove: NaN };
  } else {
    return isMatch(rest, rowsAbove + 1);
  }
}

function getMatchCandidates(pattern: string[]) {
  //   console.log(pattern);
  const [lineToMatch, ...rest] = pattern;
  //   console.log(lineToMatch);

  const matchingIndexes = rest
    .map((line, i) => {
      return {
        isMatch: lineToMatch == line,
        index: i,
      };
    })
    .filter((o) => o.isMatch)
    .map((p) => p.index);

  //   console.log(matchingIndexes);

  return matchingIndexes.map((index) => {
    return rest.slice(0, index);
  });
}
function transpose<T>(array: T[][]): T[][] {
  return array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
}

// 42068 is not correct
// 25883 is not correct
// 18499 is not correct
// 35118 is not correct
// 35098 is not correct
// 35099 is not correct

logTime("Part 1");

logTime("Part 2");

export {};
