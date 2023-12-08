import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");

const LRSequence = data[0].split("").map((c) => (c == "L" ? 0 : 1));

// console.log({ LRSequence });

data = data.slice(2);
const regex = /^([A-Z0-9]{3}) = \(([A-Z0-9]{3}), ([A-Z0-9]{3})\)$/;
const instructions: Record<string, string[]> = {};

data.forEach((line) => {
  const match = line.match(regex);
  if (match) {
    const [_, key, L, R] = match;
    instructions[key] = [L, R];
  }
});

const keys = Object.keys(instructions);

let locations = keys.filter((k) => k[2] == "A");
// console.log({ locations });

const periods = locations.map((location) => {
  let count = 0;
  const start = JSON.parse(JSON.stringify(location));
  const locations: any[][] = [];
  do {
    const direction = LRSequence[count % LRSequence.length];
    count = count + 1;
    location = instructions[location][direction];
    if (location[2] == "Z") {
      locations.push([location, count]);
    }

    if (locations.length > 1) {
      if (locations[0][0] == location) {
        break;
      }
    }
  } while (true);
  return locations;
});

const t = periods.map((period) => period.map((p) => p[1]));
// const ttt = t.flatMap((tt) => tt[0]);

// console.log(ttt);

function gcd(a: number, b: number) {
  if (a == 0) return b;
  return gcd(b % a, a);
}

function findGCD(arr: number[], n: number) {
  let result = arr[0];
  for (let i = 1; i < n; i++) {
    result = gcd(arr[i], result);

    if (result == 1) {
      return 1;
    }
  }
  return result;
}

const ttt = t.map((t) => findGCD(t, t.length));
console.log(ttt);

// console.log(gcd(2, 3));
const greatest = findGCD(ttt, t.length);
const top = ttt.reduce((a, c) => a * c);
console.log({ top, greatest });
const answer = top / greatest;
console.log(top / greatest);

// const a = [79, 47, 59, 67, 61, 53];
// const answer = a.reduce((a, c) => a * c);
// const greatest2 = findGCD(a, a.length);
// console.log(answer / greatest2);
// while (true) {
//   locations = locations.map((location) => {
//     //   console.log({ location, count, direction });
//   });
//   //   count = count + 1;
//   //   if (count > 10) {
//   //     break;
//   //   }
//   //   console.log({ locations });
//   const finished = locations.reduce((a, c) => {
//     return a && c[2] == "Z";
//   }, true);
//   if (finished) {
//     break;
//   } else {
//     count = count + 1;
//   }
// }

// console.log({ count: count + 1 });

logTime("Part 1");

logTime("Part 2");

export {};
