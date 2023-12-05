import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");

const seeds = data[0]
  .split(":")[1]
  .trim()
  .split(" ")
  .map((c) => parseInt(c));
// .slice(1, 2);
console.log({ seeds });
data.shift();

const maps: Record<string, any[]> = {};

let currentMapKey = "";
data.forEach((line) => {
  const match = line.match(/[a-z\-]+/);
  if (match) {
    currentMapKey = match[0];
    maps[currentMapKey] = [];
    return;
  }
  if (line.length == 0) {
    return;
  }
  const [dest, sour, len] = line.split(" ").map((c) => parseInt(c));

  function mapThis(arg: number) {
    if (arg >= sour && arg < sour + len) {
      return arg - sour + dest;
    } else {
      return null;
    }
  }

  maps[currentMapKey].push(mapThis);
});

const mapKeps = Object.keys(maps);
const results = seeds.map((seed) => {
  let nu = seed;
  mapKeps.forEach((key) => {
    // console.log({ key });
    // console.log(nu);
    const map = maps[key];
    let res: null | number = null;
    let found = false;
    map.forEach((mapFunction) => {
      if (found) {
        return;
      }
      res = mapFunction(nu);
      // console.log({ res });
      if (res != null) {
        nu = res;
        found = true;
        return;
      }
      if (res == null) {
        res = nu;
      }
      nu = res;
    });
  });
  return nu;
});
console.log(
  results.reduce((a, c) => {
    return a < c ? a : c;
  })
);

logTime("Part 1");

logTime("Part 2");

export {};
