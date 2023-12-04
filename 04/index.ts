import { sum } from "../common";
import { readFile, getTimeLogger } from "../common";
import { toKey, get3By3 } from "../common/grid";
import { get0To } from "../common/range";

const logTime = getTimeLogger();

var data = readFile("input");

function getNumbers(line: string) {
  return line
    .trim()
    .split(" ")
    .map((s) => parseInt(s));
}

const cards = data.map((line, i) => {
  const indexOfColon = line.indexOf(":");
  const numbers = line.slice(indexOfColon + 1);
  const [winningString, otherString] = numbers.split("|");
  return {
    cardNumber: i + 1,
    winningNumbers: getNumbers(winningString),
    otherNumbers: getNumbers(otherString),
    score: 0,
    numberOfCopies: 1,
  };
});

cards.map((card, i) => {
  let cardsToCopy = 0;
  card.otherNumbers.forEach((number) => {
    const numberOfMatches = card.winningNumbers.indexOf(number);
    if (numberOfMatches != -1) {
      cardsToCopy = cardsToCopy + 1;
      if (card.score == 0) {
        card.score = 1;
      } else {
        card.score = card.score * 2;
      }
    }
  });
  if (cardsToCopy > 0) {
    for (var j = i + 1; j <= i + cardsToCopy; j = j + 1) {
      cards[j].numberOfCopies = cards[j].numberOfCopies + card.numberOfCopies;
    }
  }
});

logTime("Part 1");

const score = cards.reduce((a, c) => a + c.score, 0);
console.log(score);

logTime("Part 2");

const numberOfCopies = cards.reduce((a, c) => a + c.numberOfCopies, 0);
console.log(numberOfCopies);

export {};
