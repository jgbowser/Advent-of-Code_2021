const fs = require("fs");

const data = fs.readFileSync("./test.txt", "utf-8");

const plotPoints = data
  .split("\n")
  .filter((v) => !!v)
  .map((v) => v.split(" -> "))

function parsePoints(points) {
  return points.map(p => p.split(","));
}

function filterOutDiagonals(allPoints) {
  return allPoints.filter(set => {
    const parsedSet = parsePoints(set);
    if( parsedSet[0][0] === parsedSet[1][0] || parsedSet[0][1] === parsedSet[1][1]) {
      return true
    } else {
      return false
    };
  });
};

function interpolateLines(points) {
  // sort each set of points in ascending order to make things a bit more manageable
  points.sort();
  const interpolatedLine = [];
  const allLines =[];
  // for each set of points first check if it is changing horizontally or vertically
  // then parseInt the start and end numbers
  // for loop and push the interpolated points from i = 1 + start; i < end -> .push(`${i},{constant}`)
  // once the loop ends, push the whole interpolated set into allLines and repeat
  // once we have all interpolated lines, flatten the array and loop through incrementing counter any time we see a duplicate for the first time
  // return the value of the counter for our final answer

};

const filteredPoints = filterOutDiagonals(plotPoints);
const interpolatedData = interpolateLines(filteredPoints);
