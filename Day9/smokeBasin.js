const fs = require("fs");

const data = fs.readFileSync("./reliefMap.txt", "utf-8");

const dataArr = data
  .split("\n")
  .filter(v => !!v)
  .map(v => v.split("").map(v => parseInt(v)));

  // Part 1: find points where every surrounding point is lower than it and calculate risk level by adding one to
  // points that meet this condition, and then summing them all up
  
let rowLength = dataArr[0].length;
let riskLevels = [];


for (let i = 0; i < dataArr.length; i++) {
  for (let j = 0; j < rowLength; j++) {
    const current = dataArr[i][j];
    const left = j === 0 ? undefined : dataArr[i][j - 1];
    const right = j === rowLength - 1 ? undefined : dataArr[i][j + 1];
    const above = i === 0 ? undefined : dataArr[i - 1][j];
    const below = i === dataArr.length - 1 ? undefined : dataArr[i + 1][j];

    if(
      (current < left || left === undefined) && 
      (current < right || right === undefined) && 
      (current < above || above === undefined) && 
      (current < below || below === undefined)) {
        riskLevels.push(current + 1);
      }
  }
}

console.log("Risk level sum: ", riskLevels.reduce((a, c) => a + c));
