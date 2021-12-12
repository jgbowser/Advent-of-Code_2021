const fs = require("fs");

const data = fs
  .readFileSync("signals.txt", "utf-8")
  .split("\n")
  .filter(v => !!v);
const signals = data.map(l => l.split(" | ")[0]);
const outputs = data.map(l => l.split(" | ")[1]);

// Part 1: find out how many times numbers with unique segment counts show up

/*
Segments per number:
# 1 - 2 segments
# 2 - 5 segments
# 3 - 5 segments
# 4 - 4 segments
# 5 - 5 segments
# 6 - 6 segments
# 7 - 3 segments
# 8 - 7 segments
# 9 - 6 segments
# 0 - 6 segments

unique segment counts: 2(#1), 3(#7), 4(#4), 7(#8)
*/

function countUniqueOutputs(outputs) {
  const digits = outputs.map(l => l.split(" "));
  let count = 0;

  for (d in digits) {
    for (let i = 0; i < 4; i++) {
      if ([2, 3, 4, 7].includes(digits[d][i].length)) {
        count++;
      }
    }
  }

  return count;
}

console.log("number of unique segment digits: ", countUniqueOutputs(outputs));

// Part 2: decode each digit and get the sum of all outputs added together

/*
How to decode segments:
 - Top Segment: compare 1 (2 char code) and 7 (3 char code). Find the char 7 has that 1 does not.
 - Bottom Segment: add top segment letter to 4 (4 char code), check all 6 char codes and remove matching letter, the 6 char code that has 1 remaining letter is nine, and the remaining char is bottom segment
 - Middle Segment: add top and bottom letters to 1, remove all letters from 3 (3 is only 5 char code that contains both chars from 1)
 - Top Left: add middle seg and bottom tag to seven and find remaining char from 4
 ... Lost track of what I was doing here, and I ended up not finding every segment character, but did a mix of using individual segments and known digits to construct codes for unknown digits
*/

function getDigitsFromPattern(patternLine) {
  // start with know numbers (1, 4, 7, 8) and start removing known segments from unknown digits until every number code is known
  // return the number codes for comparison against output
  const one = [...patternLine]
    .filter(p => p.length === 2)[0]
    .split("")
    .sort()
    .join("");
  const four = [...patternLine]
    .filter(p => p.length === 4)[0]
    .split("")
    .sort()
    .join("");
  const seven = [...patternLine]
    .filter(p => p.length === 3)[0]
    .split("")
    .sort()
    .join("");
  const eight = [...patternLine]
    .filter(p => p.length === 7)[0]
    .split("")
    .sort()
    .join("");

  const fiveSegmentCodes = [...patternLine]
    .filter(p => p.length === 5)
    .map(p => p.split("").sort().join(""));
  const sixSegmentCodes = [...patternLine]
    .filter(p => p.length === 6)
    .map(p => p.split("").sort().join(""));

  const three = fiveSegmentCodes
    .filter(p => {
      return (
        p.split("").findIndex(e => e === one[0]) !== -1 &&
        p.split("").findIndex(e => e === one[1]) !== -1
      );
    })
    .join("");

  const segments = {};

  segments.t = seven.replace(one[0], "").replace(one[1], "");

  const fourPlusTopSegment = four + segments.t;

  for (let i = 0; i < sixSegmentCodes.length; i++) {
    const potentialSegChar = sixSegmentCodes[i]
      .replace(fourPlusTopSegment[0], "")
      .replace(fourPlusTopSegment[1], "")
      .replace(fourPlusTopSegment[2], "")
      .replace(fourPlusTopSegment[3], "")
      .replace(fourPlusTopSegment[4], "");

    if (potentialSegChar.length === 1) {
      segments.b = potentialSegChar;
      break;
    }
  }

  const onePlusTopAndBottom = one + segments.t + segments.b;

  segments.m = three
    .replace(onePlusTopAndBottom[0], "")
    .replace(onePlusTopAndBottom[1], "")
    .replace(onePlusTopAndBottom[2], "")
    .replace(onePlusTopAndBottom[3], "");

  const zero = sixSegmentCodes
    .filter(c => c.indexOf(segments.m) === -1)
    .join("");

  for (let i = 0; i < sixSegmentCodes.length; i++) {
    const potentialSegChar = sixSegmentCodes[i]
      .replace(three[0], "")
      .replace(three[1], "")
      .replace(three[2], "")
      .replace(three[3], "")
      .replace(three[4], "");

    if (potentialSegChar.length === 1) {
      segments.tl = potentialSegChar;
      break;
    }
  }

  const nine = (three + segments.tl).split("").sort().join("");

  const almostFive = segments.t + segments.m + segments.b + segments.tl;

  for (let i = 0; i < fiveSegmentCodes.length; i++) {
    const potentialSegChar = fiveSegmentCodes[i]
      .replace(almostFive[0], "")
      .replace(almostFive[1], "")
      .replace(almostFive[2], "")
      .replace(almostFive[3], "");

    if (potentialSegChar.length === 1) {
      segments.br = potentialSegChar;
      break;
    }
  }

  const five = (
    segments.t +
    segments.tl +
    segments.m +
    segments.br +
    segments.b
  )
    .split("")
    .sort()
    .join("");

  const two = fiveSegmentCodes
    .filter(p => p !== three && p !== five)
    .sort()
    .join("");

  const six = sixSegmentCodes
    .filter(p => p !== zero && p !== nine)
    .sort()
    .join("");

  const numbers = {};
  numbers[zero] = 0;
  numbers[one] = 1;
  numbers[two] = 2;
  numbers[three] = 3;
  numbers[four] = 4;
  numbers[five] = 5;
  numbers[six] = 6;
  numbers[seven] = 7;
  numbers[eight] = 8;
  numbers[nine] = 9;

  return numbers;
}

let outputTotal = 0;

for (let i = 0; i < signals.length; i++) {
  const lineOutput = [];
  const digitCodes = getDigitsFromPattern(signals[i].split(" "));
  outputs[i].split(" ").forEach(o => {
    const sortedOutput = o.split("").sort().join("");
    lineOutput.push(digitCodes[sortedOutput]);
  });
  outputTotal += parseInt(lineOutput.join(""));
}

console.log("Output total: ", outputTotal);
