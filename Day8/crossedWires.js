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

  // 3 is the only 5 segment digit that contains both segments in 1
  const three = fiveSegmentCodes
    .filter(p => {
      return (
        p.split("").findIndex(e => e === one[0]) !== -1 &&
        p.split("").findIndex(e => e === one[1]) !== -1
      );
    })
    .join("");

  // keep track of easy to decipher segments so that we can add and subtract them to make finding numbers easier
  const segments = {};

  // top segment is found by removing the common segments between 7 and 1
  segments.t = seven.replace(one[0], "").replace(one[1], "");

  // now we can find the bottom segment by adding the top segment to 4 and removing the common segments between it and 9
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

  // Now we add the top and bottom segments to 1 and remove common segments between it and 3 to find the middle segment
  const onePlusTopAndBottom = one + segments.t + segments.b;

  segments.m = three
    .replace(onePlusTopAndBottom[0], "")
    .replace(onePlusTopAndBottom[1], "")
    .replace(onePlusTopAndBottom[2], "")
    .replace(onePlusTopAndBottom[3], "");

  // Zero is only 6 segment digit without the middle segment
  const zero = sixSegmentCodes
    .filter(c => c.indexOf(segments.m) === -1)
    .join("");

  // find the top left segment by removing common segments between 3 and 5 (the only 6 seg  digit with 1 segment remaining after the compare/remove with 3)
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

  // probably could have gotten this more easily earlier when finding the bottom segment *shrugs*
  // add top left segment to 3 and you've got 9
  const nine = (three + segments.tl).split("").sort().join("");

  // construct 5 (minus the bottom right segment). We need bottom right to be able to differentiate some remaining numbers
  const almostFive = segments.t + segments.m + segments.b + segments.tl;

  //since we have 5 (with 1 missing segment) we know that if we remove these almost-five-segments from every digit made of five segments, the one with 1 segment left at the end is 5, and that segment is bottom right
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

  // we have all the segment chars to construct 5, again probably could have gotten this easier right above this....but it's 3:30am and I am losing my mind...
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

  // we know 2 of the 3 5 segment digits, the remaining one has to be 2
  const two = fiveSegmentCodes
    .filter(p => p !== three && p !== five)
    .sort()
    .join("");

  // we know 2 of the six segment digits, the remaining one has to be 6
  const six = sixSegmentCodes
    .filter(p => p !== zero && p !== nine)
    .sort()
    .join("");

  // thats it! all the numbers are accounted for, return an object with the digit's sorted segment code as the key and the number it corresponds to as the value
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
