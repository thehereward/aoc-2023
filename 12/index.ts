import { max, sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

const repetitions = 1;

var data = readFile("input");
var lines = data.map((line) => line.split(" "));
var records = lines.map((line) => {
  const c = new Array(repetitions);
  const b = c.fill(line[1]).join(",");

  return {
    record: line[0].repeat(repetitions),
    records: [""],
    check: b.split(",").map((char) => parseInt(char)),
    count: 0,
  };
});
logTime("Records made");

// const numberRecords = records.length;
// records.forEach((record, i) => {
//   //   logTime(`Of ${numberRecords} processing ${i}`);
//   var accumulator: string[] = [""];
//   record.record.split("").forEach((char) => {
//     accumulator = accumulator.flatMap((line) => {
//       if (char == "?") {
//         return [line + ".", line + "#"];
//       } else {
//         return [line + char];
//       }
//     });
//   });
//   record.records = accumulator;
// });

const toProcess = records
  .map((r) => {
    return { check: r.check, record: r.record };
  })
  .filter((x, i) => i == 2);

var record = toProcess.shift();

var count = 0;
while (!!record) {
  const validNewStrings: any[] = processRecord(record);

  console.log(validNewStrings);
  record = validNewStrings.shift();
}
//   //   var match1: RegExpMatchArray | null = null
//   //   do{
//   //   r.match(blockRegex)
//   // } while (match1 != null)
//   const newRegex = new RegExp(
//     `(?<=[^#]|^)[#?]{${biggestBlock}}(?=[^#]|$)`,
//     "g"
//   );
//   // console.log(r);
//   //   const removeBefore = r.slice(beforeLength + 1);
//   // console.log(removeBefore);
//   //   const removeAfter = removeBefore.slice(0, removeBefore.length - afterLength);
//   // console.log(removeAfter);
//   const matches = r.matchAll(newRegex);
//   var localCount = 0;
//   for (const match of matches) {
//     console.log(match);
//     const index = match.index || 0;
//     const newStrings = [
//       { record: r.slice(0, index), check: blocksBefore },
//       { record: r.slice(index + biggestBlock), check: blocksAfter },
//     ].filter((s) => s.check.length);
//     // && s.record.split("").filter((c) => c != ".").length
//     if (newStrings.length == 0) {
//       count++;
//     }
//     console.log({ localCount, count });
//     console.log(newStrings);
//     const toAdd = newStrings.filter(
//       (s) => s.record.split("").filter((c) => c != ".").length
//     );
//     toProcess.unshift(...toAdd);
//     console.log("");
//   }
//   record = toProcess.shift();
// }

console.log({ count });
const inside = "\\.+";
records.forEach((record) => {
  const checks = record.check.map((char) => `#{${char}}`);
  const inner = checks.join(inside);
  const regex = `^\\.*${inner}\\.*$`;
  var count = 0;
  //   console.log(regex);
  record.records.forEach((r) => {
    const result = r.match(regex);
    if (!!result) {
      count++;
    }
  });
  //   console.log(count);
  record.count = count;
});

// const part1 = records.map((record) => record.count).reduce(sum);
// console.log(part1);

const regex = /^\.*#{1}\.+#{1}\.+#{3}\.*$/;
// records.forEach((r) => console.log(r.count));
// const t = records[1].records;
// t.forEach((tt) => console.log(tt));
// console.log(records);
// const progress: string[][] = [[""]];

// test2.forEach((h) => {

//   if (h.length == 2) {
//     return [

//     ]
//   }
//   h.forEach((char) => {
//     progress.forEach((line) => {
//       line.push(char);
//     });
//   });
// });
// console.log(progress);

// records.forEach(record => {
//     record.records = record.records.flatMap(record=> {
//         const newRecords: string[][] = []
//         record.split("").forEach(char => {

//         })
//     })
// })

// console.log(records);

logTime("Part 1");

logTime("Part 2");

export {};
function processRecord(record: { record: string; check: number[] }) {
  console.log("");
  console.log({ record });
  const blocks = record.check;
  const r = record.record;

  const biggestBlock = blocks.reduce(max, 0);
  const location = blocks.findIndex((c) => c == biggestBlock);
  //   console.log({ maxCheck, location });
  const blocksBefore = blocks.slice(0, location);
  //   console.log({ checksBefore });
  //   const beforeLength = blocksBefore.reduce(sum, 0) + location;
  const blocksAfter = blocks.slice(location + 1);
  //   console.log({ checksAfter });
  //   const afterLength = blocksAfter.reduce(sum, 0) + blocks.length - location - 1;
  //   console.log({ beforeLength, afterLength });
  const blockRegex = new RegExp(`(?<![#])[#?]{${biggestBlock}}(?![#])`);
  console.log({ biggestBlock });

  var stringUnderTest = record.record;
  const validNewStrings: any[] = [];
  while (stringUnderTest.length > 0) {
    const match2 = stringUnderTest.match(blockRegex);
    // console.log(match2);
    if (match2 == null) {
      break;
    }
    const index = match2.index;

    if (index == undefined) {
      break;
    }

    const newStrings = [
      { record: r.slice(0, index), check: blocksBefore },
      { record: r.slice(index + biggestBlock), check: blocksAfter },
    ];

    if (newStrings.filter((t) => isFinished(t)).length == 2) {
      count++;
    } else {
      const validStrings = newStrings.filter((t) => !isInvalid(t));
      validNewStrings.push(...validStrings);
    }
    // console.log(validStrings.length);
    stringUnderTest = stringUnderTest.slice(index + 1);
    // console.log(stringUnderTest);
    // console.log("");
    // break;
  }
  return validNewStrings;
}

function isInvalid(t: { record: string; check: number[] }) {
  const invalid_blocks_left =
    t.check.length > 0 && t.record.replace(".", "").length == 0;
  const invalid_hashes_left =
    t.check.length == 0 && t.record.replace("#", "").length != 0;
  const invalid = invalid_blocks_left || invalid_hashes_left;
  return invalid;
}

function isFinished(t: { record: string; check: number[] }) {
  const finished =
    t.check.length == 0 && t.record.replace("#", "").length == t.record.length;
  return finished;
}
