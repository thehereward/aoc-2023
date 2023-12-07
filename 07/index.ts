import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

type CardLabel =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

const SCORE = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];

var data = readFile("input");

type HandSummary = Record<string, number>;

const hands = data.map((line) => {
  const [hand, bid] = line.split(" ");
  const summary = hand.split("").reduce<HandSummary>((a, c) => {
    a[c] = a[c] ? a[c] + 1 : 1;
    return a;
  }, {});
  return {
    hand,
    bid: parseInt(bid),
    summary,
    handType: getHandType(summary),
  };
});

const sorted = hands.sort((a, b) => {
  if (a.handType != b.handType) {
    return a.handType - b.handType;
  }
  for (var i = 0; i < 5; i = i + 1) {
    const scoreA = SCORE.findIndex((c) => c == a.hand[i]);
    const scoreB = SCORE.findIndex((c) => c == b.hand[i]);
    if (scoreA != scoreB) {
      return scoreA - scoreB;
    }
  }

  return 0;
});

const maxRank = sorted.length;

const result = sorted.reduce((a, c, i) => {
  return a + c.bid * (maxRank - i);
}, 0);

console.log({ result });

function getHandType(summary: HandSummary) {
  if (isFiveKind(summary)) {
    return 0;
  }
  if (isFourKind(summary)) {
    return 1;
  }
  if (isFullHouse(summary)) {
    return 2;
  }
  if (isThreeKind(summary)) {
    return 3;
  }
  if (isTwoPair(summary)) {
    return 4;
  }
  if (isPair(summary)) {
    return 5;
  }
  return 6;
}

function isFiveKind(summary: HandSummary) {
  return Object.keys(summary).length == 1;
}

function isFourKind(summary: HandSummary) {
  const keys = Object.keys(summary);
  if (keys.length != 2) {
    return false;
  }
  const firstKey = keys[0];
  return summary[firstKey] == 4 || summary[firstKey] == 1;
}

function isFullHouse(summary: HandSummary) {
  const keys = Object.keys(summary);
  if (keys.length != 2) {
    return false;
  }
  const firstKey = keys[0];
  return summary[firstKey] == 3 || summary[firstKey] == 2;
}

function isThreeKind(summary: HandSummary) {
  const keys = Object.keys(summary);
  if (keys.length != 3) {
    return false;
  }

  return (
    summary[keys[0]] == 3 || summary[keys[1]] == 3 || summary[keys[2]] == 3
  );
}

function isTwoPair(summary: HandSummary) {
  const keys = Object.keys(summary);
  if (keys.length != 3) {
    return false;
  }
  return (
    summary[keys[0]] == 1 || summary[keys[1]] == 1 || summary[keys[2]] == 1
  );
}

function isPair(summary: HandSummary) {
  const keys = Object.keys(summary);
  return keys.length == 4;
}

logTime("Part 1");

logTime("Part 2");

export {};
