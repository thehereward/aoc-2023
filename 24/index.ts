import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

const example1 = runPart1("example", 7, 27);
console.log({ example1 });
const part1 = runPart1("input", 200000000000000, 400000000000000)
console.log(({ part1 }));

logTime("Part 1");

const example2 = runPart2("example")
console.log({example2});

const part2 = runPart2("input")
console.log({part2});

// 24 wrong
// 64 wrong
// 606772018765658 too low
// 606772018765659

logTime("Part 2");

export { };

function runPart1(fileName: string, MIN: number, MAX: number) {
    const stones = getStones(fileName);

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
    var count = 0;
    for (var i = 0; i < stones.length; i++) {
        for (var j = i + 1; j < stones.length; j++) {
            const a = stones[i];
            const b = stones[j];
            const [pA, vA] = a;
            const [pB, vB] = b;
            // console.log(pA, vA, "|", pB, vB)
            const tb = (pA[1] - pB[1] + (pB[0] - pA[0]) * (vA[1] / vA[0])) / (vB[1] - ((vA[1] * vB[0]) / vA[0]));
            if (tb < 0) {
                // in the past - skip
                continue;
            }
            const xt = pB[0] + vB[0] * tb;
            const yt = pB[1] + vB[1] * tb;

            if (xt < MIN || xt > MAX || yt < MIN || yt > MAX) {
                // not in the area - skip
                continue;
            }

            // (xt - x) /  =  t
            const t1 = (xt - pA[0]) / vA[0];
            if (t1 < 0) {
                // other one in the past - skip
                continue;
            }

            // console.log(a, b)
            // console.log(i, j, xt, yt)
            count++;
        }
    }
    return count;
}

function runPart2(fileName: string) {
    const stones = getStones(fileName);
    const X = 0
    const Y = 1
    const Z = 2
    const equationsXY = solveFor(stones, Y, X);
    const Yn = Math.round(equationsXY[4].slice(-1)[0]);
    // console.log(equationsXY[4]);
    const equationsYX = solveFor(stones, X, Y);
    const Xn = Math.round(equationsYX[4].slice(-1)[0]);
    // console.log(equationsYX[4]);
    const equationsYZ = solveFor(stones, Z, Y);
    const Zn = Math.round(equationsYZ[4].slice(-1)[0]);
    // console.log(equationsYZ[4]);
    // console.log(({ Xn }));
    // console.log(({ Yn }));
    // console.log(({ Zn }));

    return Xn + Yn + Zn
}

function solveFor(stones: number[][][], Y: number, X: number) {
    // console.log((""));
    // console.log(`Solving for ${Y} and ${X}`);
    const equations = stones.map(stone => {
        const [p, v] = stone;
        return [
            1,
            -p[Y],
            v[Y],
            p[X],
            -v[X],
            p[X] * v[Y] - p[Y] * v[X]];
    });

    for (var i = 0; i < equations.length && i < equations[0].length - 1; i++) {
        const a = equations[i];
        // console.log((a));

        const toUnit = a[i];
        a.forEach((val, index) => a[index] = val / toUnit);

        for (var j = i + 1; j < equations.length; j++) {
            const b = equations[j];
            const factor = b[i] / a[i];
            b.forEach((val, index) => b[index] = val - (a[index] * factor));
        }
    }
    return equations;
}

function getStones(fileName: string) {
    var data = readFile(fileName);
    const stones = data.map(line => line.split(" @ "))
        .map(line => line.map(char => char.split(",")
            .map(p => parseInt(p))));
    return stones;
}
