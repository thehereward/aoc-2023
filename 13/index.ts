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

const maps = patterns.map((pattern1) => {
  const pattern = pattern1.map((line) => line.split(""));
  const width = pattern[0].length;
  for (var col = 1; col < width; col++) {
    var mismatchCount = 0;
    for (var offset = 1; offset <= width - col && offset <= col; offset++) {
      const colR = col + offset - 1;
      const colL = col - offset;
      //   console.log(col, offset, width);
      for (var row = 0; row < pattern.length; row++) {
        const left = pattern[row][colL];
        const right = pattern[row][colR];
        const mismatch = left != right;
        // console.log(row, colL, colR, left, right);
        if (mismatch) {
          //   console.log("");
          mismatchCount++;
        }
        if (mismatchCount > 1) {
          break;
        }
      }
      if (mismatchCount > 1) {
        break;
      }
    }
    if (mismatchCount == 1) {
      return col;
    }
  }

  const height = pattern.length;
  for (var row = 1; row < height; row++) {
    var mismatchCount = 0;
    for (var offset = 1; offset <= height - row && offset <= row; offset++) {
      const rowB = row + offset - 1;
      const rowT = row - offset;
      //   console.log(col, offset, width);
      for (var col = 0; col < pattern[0].length; col++) {
        const top = pattern[rowT][col];
        const bottom = pattern[rowB][col];
        const mismatch = top != bottom;
        // console.log(row, colL, colR, left, right);
        if (mismatch) {
          //   console.log("");
          mismatchCount++;
        }

        if (mismatchCount > 1) {
          break;
        }
      }
      if (mismatchCount > 1) {
        break;
      }
    }
    if (mismatchCount == 1) {
      return row * 100;
    }
  }

  throw new Error();
});

console.log(maps.reduce(sum));

// const horizontals: string[][] = JSON.parse(JSON.stringify(patterns));
// var verticals: string[][] = JSON.parse(JSON.stringify(patterns));
// verticals = verticals
//   .map((pattern) => pattern.map((line) => line.split("")))
//   .map((p) => transpose(p))
//   .map((l) => l.map((ll) => ll.join("")));

// // Horizontal Matches
// logTime("Processing from top");
// const matchesFromTop = horizontals
//   .map((pattern) => getMatchCandidates(pattern))
//   .map((candidates) => candidates.map((candidate) => isMatch(candidate, 1)))
//   .map((candidates) => candidates.filter((candidate) => candidate.matches));

// horizontals.forEach((p) => p.reverse());

// logTime("Processing from bottom");
// var matchesFromBottom = horizontals
//   .map((pattern) => getMatchCandidates(pattern))
//   .map((candidates) => candidates.map((candidate) => isMatch(candidate, 1)))
//   .map((candidates) => candidates.filter((candidate) => candidate.matches));

// const hLengths = horizontals.map((h) => h.length);

// matchesFromBottom = matchesFromBottom.map((match, i) => {
//   if (match.length == 0) {
//     return [];
//   }
//   if (match.length > 1) {
//     // console.log(match);
//     console.log("there were multiple reflection points - from bottom");
//   }
//   //   console.log(match);
//   const m = match[0];
//   return [
//     {
//       matches: m.matches,
//       rowsAbove: hLengths[i] - m.rowsAbove,
//     },
//   ];
// });

// // console.log(matchesFromBottom);

// // Vertical Matches
// logTime("Processing from left");
// const matchesFromLeft = verticals
//   .map((pattern) => getMatchCandidates(pattern))
//   .map((candidates) => candidates.map((candidate) => isMatch(candidate, 1)))
//   .map((candidates) => candidates.filter((candidate) => candidate.matches));

// verticals.forEach((p) => p.reverse());

// logTime("Processing from right");
// var matchesFromRight = verticals
//   .map((pattern) => getMatchCandidates(pattern))
//   .map((candidates) => candidates.map((candidate) => isMatch(candidate, 1)))
//   .map((candidates) => candidates.filter((candidate) => candidate.matches));

// const vLengths = verticals.map((v) => v.length);

// matchesFromRight = matchesFromRight.map((match, i) => {
//   if (match.length == 0) {
//     return [];
//   }
//   if (match.length > 1) {
//     // console.log(match);
//     console.log("there were multiple reflection points - from right");
//   }
//   const m = match[0];
//   return [
//     {
//       matches: m.matches,
//       rowsAbove: vLengths[i] - m.rowsAbove,
//     },
//   ];
// });

// // console.log(matchesFromRight);

// const hMatches = [matchesFromBottom, matchesFromTop].flat().flat();

// const vMatches = [matchesFromLeft, matchesFromRight].flat().flat();

// patterns.forEach((_, i) => {
//   const match = [
//     matchesFromTop[i],
//     matchesFromBottom[i],
//     matchesFromLeft[i],
//     matchesFromRight[i],
//   ].flat();
//   if (match.length != 1) {
//     ("error");
//   }
// });
// // console.log(hMatches);
// // console.log(vMatches);

// const hSum = hMatches.map((h) => h.rowsAbove).reduce(sum, 0);
// const vSum = vMatches.map((v) => v.rowsAbove).reduce(sum, 0);

// console.log(hSum * 100 + vSum);

// // console.log(matchesFromBottom);
// // console.log(matchesFromLeft);
// // console.log(matchesFromRight);

// function isMatch(pattern: string[], rowsAbove: number) {
//   if (pattern.length == 0) {
//     return { matches: true, rowsAbove };
//   }
//   if (pattern.length == 1) {
//     console.log("there was a reflection in the middle of a line");
//     console.log(pattern);
//     return { matches: true, rowsAbove };
//   }
//   const [first, ...tail] = pattern;
//   const [last, ...rest] = tail.reverse();
//   if (first != last) {
//     return { matches: false, rowsAbove: NaN };
//   } else {
//     return isMatch(rest, rowsAbove + 1);
//   }
// }

// function getMatchCandidates(pattern: string[]) {
//   //   console.log(pattern);
//   const [lineToMatch, ...rest] = pattern;
//   //   console.log(lineToMatch);

//   const matchingIndexes = rest
//     .map((line, i) => {
//       return {
//         isMatch: lineToMatch == line,
//         index: i,
//       };
//     })
//     .filter((o) => o.isMatch)
//     .map((p) => p.index);

//   //   console.log(matchingIndexes);

//   return matchingIndexes.map((index) => {
//     return rest.slice(0, index);
//   });
// }
// function transpose<T>(array: T[][]): T[][] {
//   return array[0].map((_, colIndex) => array.map((row) => row[colIndex]));
// }

// 42068 is not correct
// 25883 is not correct
// 18499 is not correct
// 35118 is not correct
// 35098 is not correct
// 35099 is not correct

logTime("Part 1");

logTime("Part 2");

export {};

// function CalculateValue(map: boolean[][]) {
//   for (var i = 1; i < map[0].length; ++i) {
//     var isVertical = true;
//     for (var j = 1; i - j >= 0 && i - 1 + j < map[0].length; ++j) {
//       for (var y = 0; y < map.length; ++y) {
//         var a = i - j;
//         var b = i - 1 + j;

//         if (map[y][a] != map[y][b]) {
//           isVertical = false;
//           break;
//         }
//       }
//       if (!isVertical) {
//         break;
//       }
//     }

//     if (isVertical) {
//       return i;
//     }
//   }

//   for (var i = 1; i < map.length; ++i) {
//     var isHorizontal = true;
//     for (var j = 1; i - j >= 0 && i - 1 + j < map.length; ++j) {
//       for (var x = 0; x < map[0].length; ++x) {
//         var a = i - j;
//         var b = i - 1 + j;

//         if (map[a][x] != map[b][x]) {
//           isHorizontal = false;
//           break;
//         }
//       }
//       if (!isHorizontal) {
//         break;
//       }
//     }

//     if (isHorizontal) {
//       return i * 100;
//     }
//   }

//   throw new Error("This went wrong");
// }
