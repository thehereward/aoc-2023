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
  const e = d.fill(line[0]).join("?");

  return {
    record: e,
    records: [""],
    check: b.split(",").map((char) => parseInt(char)),
    count: 0,
  };
});
logTime("Records made");

const toProcess = records.map((r) => {
  return { check: r.check, record: r.record };
});

const memory = new Map<string, number>();
var misses = 0;
var hits = 0;
const p = toProcess.map((record) => processRecord(record)).reduce(sum);
// 2771633347978 too high
console.log({ p, hits, misses });

logTime("Part 1");

logTime("Part 2");

export {};

function processRecord(record: { record: string; check: number[] }): number {
  const blocks1 = record.check;
  const r1 = record.record;
  const key = `${r1}${blocks1}`;
  if (!memory.has(key)) {
    misses++;
    if (blocks1.length == 0) {
      return noHashRemaining(r1) ? 1 : 0;
    }

    if (r1.length == 0) {
      return 0;
    }

    if (r1[0] == ".") {
      return processRecord({
        record: r1.slice(1),
        check: blocks1,
      });
    }

    const [head, ...rest] = blocks1;

    if (head > r1.length) {
      return 0;
    }

    const match =
      r1
        .slice(0, head)
        .split("")
        .every((char) => char == "?" || char == "#") && r1[head] != "#";

    const sibCount =
      r1[0] === "#"
        ? 0
        : processRecord({ record: r1.slice(1), check: blocks1 });

    const childCount = match
      ? processRecord({
          record: r1.slice(head + 1),
          check: rest,
        })
      : 0;

    const answer = sibCount + childCount;

    memory.set(key, answer);
  } else {
    hits++;
  }

  return memory.get(key) || 0;
}

function noHashRemaining(r: string) {
  return r.indexOf("#") == -1;
}
