import { max, sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

const repetitions = 5;

var data = readFile("input");
var lines = data.map((line) => line.split(" "));
var records = lines.map((line) => {
  const c = new Array(repetitions);
  const b = c.fill(line[1]).join(",");
  const d = new Array(repetitions);
  const e = d.fill(line[0]).join("?")

  return {
    record: e,
    records: [""],
    check: b.split(",").map((char) => parseInt(char)),
    count: 0,
  };
});
logTime("Records made");

const toProcess = records
  .map((r) => {
    return { check: r.check, record: r.record };
  })
  // .filter((x, i) => i == 5);


// console.log(toProcess)
// console.log("")
var record = toProcess.shift();

var count = 0;
var iterations = 0
while (!!record) {
  if (iterations % 1000000 == 0){
    logTime(`Got to ${iterations}`)
  }
  const validNewStrings: any[] = processRecord(record);

  toProcess.unshift(...validNewStrings)
  // console.log(toProcess);
  // console.log({ count })
  record = toProcess.shift()
  // console.log("")
  iterations++
}

// console.log(655360 - 506250)
// ??????????
// ?????????
console.log({ count });

const regex = /^\.*#{1}\.+#{1}\.+#{3}\.*$/;

logTime("Part 1");

logTime("Part 2");

export { };
function processRecord(record: { record: string; check: number[] }) {
  // console.log("");
  // console.log({ record });
  const blocks = record.check.map(c => c)
  var r = record.record;

  if (noHashRemaining(r) && blocks.length == 0) {
    // finished
    count++
    return []
  }

  if (noHashRemaining(r) && noQuestionRemaining(r) && blocks.length != 0) {
    // error
    return []
  }

  if (blocks.length == 0) {
    return []
  }

  const block = blocks.shift()
  if (block == undefined) {
    // should not happen
    return []
  }
  const regexToUse = new RegExp(`[\#\?]{${block}}(?![\#])`);
  var match44 = r.match(regexToUse)
  // console.log({match44})
  if (!match44) {
    return []
  }
  const { index } = match44
  if (index == undefined) {
    // should never happen
    return []
  }

  const before = r.slice(0, index)
  if (!noHashRemaining(before)){
    return []
  }

  const newRecords: { record: string; check: number[] }[] = []
  if (match44[0][0] != '#') {
    newRecords.push({
      check: [block, ...blocks],
      record: r.slice(index + 1)
    })
  }
  newRecords.push({
    check: blocks,
    record: r.slice(index + block + 1)
  })
  return newRecords


  // console.log({ match44, blocks })
  // if (index != undefined) {
  //   const nextChar = r[index + block]
  //   // console.log({ match44, blocks, nextChar })
  //   if (nextChar != '#') {
  //     const after = r.slice(index + block + 1)
  //     newRecords.push(
  //       {
  //         check: blocks,
  //         record: after
  //       }
  //     )

  //     r = r.slice(index + 1)
  //   } else {
  //     r = r.slice(1)
  //   }
  // }
  // return newRecords
}

function noHashRemaining(r: string) {
  return r.indexOf("#") == -1;
}

function noQuestionRemaining(r: string) {
  return r.indexOf("?") == -1;
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
