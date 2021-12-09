const fs = require("fs");

const data = fs.readFileSync("./ventPlot.txt", "utf-8");

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

function interpolateHorizontalLines(points, start, end, constant) {
  const line = [points[0], points[1]];

  if(start < end) {
    for(let i = start + 1; i < end; i++) {
      line.push(`${i},${constant}`);
    };
  } else {
    for(let i = start - 1; i > end; i--) {
      line.push(`${i},${constant}`)
    }
  }

  return line;
};

function interpolateVerticalLines(points, start, end, constant) {
  const line = [points[0], points[1]];

  if(start < end) {
    for(let i = start + 1; i < end; i++) {
      line.push(`${constant},${i}`);
    };
  } else {
    for(let i = start - 1; i > end; i--) {
      line.push(`${constant},${i}`)
    }
  }

  return line;
};

function interpolateLines(allPoints) {
  // sort each set of points in ascending order to make things a bit more manageable
  allPoints.sort();
  const interpolatedLines = [];

  allPoints.forEach(set => {
    const x1 = parseInt(set[0].split(",")[0]);
    const x2 = parseInt(set[1].split(",")[0]);
    const y1 = parseInt(set[0].split(",")[1]);
    const y2 = parseInt(set[1].split(",")[1]);

    // for each set of points first check if it is changing horizontally or vertically
    if (x1 === x2) {
      interpolatedLines.push(interpolateVerticalLines(set, y1, y2, x1));
    }

    if(y1 === y2) {
      interpolatedLines.push(interpolateHorizontalLines(set, x1, x2, y1));
    }
  })
  // once we have all interpolated lines, flatten the array and loop through incrementing counter any time we see a duplicate for the first time
  // return the value of the counter for our final answer

  return interpolatedLines;
};

function countDangerZones(data) {
  let count = 0;
  let lastCountedDupe;
  let comparisonValue;

  for(let i = 0; i < data.length; i++) {
    // if we have already counted this point as a having a duplicate skip this iteration
    if(comparisonValue === data[i] && lastCountedDupe === data[i]) continue;
    // if this point equals the comparisonValue, but we haven't counted it as a dupe increment count and set lastCountedDupe to this value
    if(comparisonValue === data[i] && lastCountedDupe !== data[i]) {
      count++
      lastCountedDupe = data[i];
    };
    // if this point does not equal the comparisonValue it isn't a duplicate, so set the comparison and move along
    if(comparisonValue !== data[i]) {
      comparisonValue = data[i]
    };
  };

  return count;
};

const filteredPoints = filterOutDiagonals(plotPoints);
const interpolatedData = interpolateLines(filteredPoints);
const flattenedSortedData = interpolatedData.flat().sort();
console.log(countDangerZones(flattenedSortedData));
