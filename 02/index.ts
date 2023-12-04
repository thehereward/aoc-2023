import { readFile, getTimeLogger } from "../common";

const logTime = getTimeLogger();

const max = {
    'red': 12,
    'green': 13,
    'blue': 14
}

var data = readFile("input");

const games = data.map(line => {
    const gameId = parseInt(line.match(/Game ([0-9]+)/)?.[1] || '')

    const rest = line.slice(line.indexOf(":") + 2).split(";")
    const drawRecords = rest.map(result => {
        const draw = result.split(",").map(s => s.trim())
        //   console.log({draw})
        const drawSet = draw.map(balls => {
            const [number, ballType] = balls.split(" ")
            return {
                number: parseInt(number),
                ballType
            }
        })

        const drawRecord = drawSet.reduce<Record<string, number>>((a, c) => {
            a[c.ballType] = c.number
            return a
        }, {})
        // console.log({ drawRecord })
        return drawRecord
    })

    return {
        gameId,
        drawRecords
    }
})

// console.log({max})
const counter = games.reduce((a, c) => {
    if (c.drawRecords.length == 0){
        return a + c.gameId
    }

    const arePossible = c.drawRecords.map(record => {
        // console.log(record)
        if (record['red'] > max.red) return false
        if (record['blue'] > max.blue) return false
        if (record['green'] > max.green) return false
        return true
    })

    const possible = arePossible.reduce((a,c) => a && c)
    // console.log(`Game ID: ${c.gameId} is ${possible ? "" : "not "}possible`)
    return possible ? a +c.gameId : a
}, 0)

// console.log({ counter });

logTime("Part 1");

const mins = games.map((c) => {
    const start = {
        'red': 0,
        'blue': 0,
        'green': 0,
    }
    c.drawRecords.forEach(record => {
        if (record['red'] > start.red) start.red = record['red']
        if (record['blue'] > start.blue) start.blue = record['blue']
        if (record['green'] > start.green) start.green = record['green']
    })

    return start
})

const powers = mins.map(min => min.blue * min.green * min.red)

console.log({powers})

const answer = powers.reduce((a,c) => a + c)


console.log({answer})
logTime("Part 2");

export { };
