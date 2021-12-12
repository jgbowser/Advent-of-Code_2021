const { count } = require("console");
const fs = require("fs");

const data = fs.readFileSync("signals.txt", "utf-8").split("\n").filter(v => !!v);
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
        count++
      }
    };
  }

  return count;
}

console.log("number of unique segment digits: ", countUniqueOutputs(outputs));