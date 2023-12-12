import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");
var lines = data.map((line) => line.split(" "));
var records = lines.map((line) => {
  return {
    record: line[0],
    records: [""],
    check: line[1].split(",").map((char) => parseInt(char)),
    count: 0,
  };
});

const test = "???.###";
records.forEach((record) => {
  var accumulator: string[] = [""];
  record.record.split("").forEach((char) => {
    accumulator = accumulator.flatMap((line) => {
      if (char == "?") {
        return [line + ".", line + "#"];
      } else {
        return [line + char];
      }
    });
  });
  record.records = accumulator;
});

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

const part1 = records.map((record) => record.count).reduce(sum);
console.log(part1);

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
