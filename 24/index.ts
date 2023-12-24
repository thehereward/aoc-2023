import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");
const stones =
    data.map(line => line.split(" @ "))
        .map(line => line.map(char => char.split(",")
            .map(p => parseInt(p))))

// const hailStones: Map<string,number[][]> = new Map()

// [[position],[velocity]]

/*

x1 + vx1 * t1 == x2 + vx2 * t2
t1 = (x2 - x1 + (vx2 * t2)) / (vx1)

y1 + vy1 * t1 == y2 + vy2 * t2
y1 + vy1 * ((x2 - x1 + (vx2 * t2)) / (vx1)) == y2 + vy2 * t2
y1 + (vy1 / vx1) * ((x2 - x1 + (vx2 * t2))) == y2 + vy2 * t2
y1 + (x2 - x1)(vy1 / vx1) + (vy1 * vx2 * t2) / vx1  == y2 + vy2 * t2
y1 - y2 + (x2 - x1)(vy1 / vx1) + (vy1 * vx2 * t2) / vx1  == vy2 * t2
y1 - y2 + (x2 - x1)(vy1 / vx1) == vy2 * t2 - (vy1 * vx2 * t2) / vx1
y1 - y2 + (x2 - x1)(vy1 / vx1) == t2 * (vy2 - (vy1 * vx2) / vx1)

(y1 - y2 + (x2 - x1)(vy1 / vx1)) / (vy2 - ((vy1 * vx2) / vx1)) == t2 
(yA - yB + (xB - xA)(vyA / vxA)) / (vyB - ((vyA * vxB) / vxA)) == tB 

 */

const MIN = 200000000000000
const MAX = 400000000000000
var count = 0
for(var i = 0; i < stones.length; i++){
    for(var j = i + 1; j < stones.length; j++){
        const a = stones[i]
        const b = stones[j]
        const [pA, vA] = a
        const [pB, vB] = b
        // console.log(pA, vA, "|", pB, vB)
        const tb = (pA[1] - pB[1] + (pB[0] - pA[0]) * (vA[1] / vA[0])) / (vB[1] - ((vA[1] * vB[0])/ vA[0]))
        if (tb < 0){
            // in the past - skip
            continue
        }
        const xt = pB[0] + vB[0] * tb
        const yt = pB[1] + vB[1] * tb

        if (xt < MIN || xt > MAX || yt < MIN || yt > MAX){
            // not in the area - skip
            continue
        }

        // (xt - x) /  =  t
        const t1 = (xt - pA[0]) / vA[0]
        if (t1 < 0){
            // other one in the past - skip
            continue
        }

        // console.log(a, b)
        // console.log(i, j, xt, yt)
        count++
    }
}

console.log(count);

logTime("Part 1");

logTime("Part 2");

export { };
