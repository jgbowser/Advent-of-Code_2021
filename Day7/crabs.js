const fs = require("fs");

const positions = fs
  .readFileSync("positions.txt", "utf-8")
  .split(",")
  .filter((v) => !!v)
  .sort();

// Part 1: Find the least amount of total movement required to get all crabs submarines in the same position

function findLeastMovement(positions) {
  let leastTotalMovement = Infinity

  for (let i = positions[0]; i < positions[positions.length - 1]; i++) {
    let differences = [];

    positions.forEach(p => {
      differences.push(Math.abs(p - i));
    });

    const movement = differences.reduce((a, c) => a + c)

    leastTotalMovement = movement < leastTotalMovement ? movement : leastTotalMovement;
  };

  return leastTotalMovement;
}

console.log("Least total movement required: ", findLeastMovement(positions));

// Part 2: each step requires 1 more fuel (1 step = 1 fuel, 2 steps = 2 fuel, etc). Again find least amount of fuel that can be used
function calculateFuelUsed(distance) {
  if (distance === 0) {
    return 0
  };

  // let's do some recursion... just for the fun of it
  return distance + calculateFuelUsed(distance - 1);
}

function findLeastFuelUsed(positions) {
  let totalFuelUsed = Infinity;

  for (let i = positions[0]; i < positions[positions.length - 1]; i++) {
    let fuelUsedPerSub = [];
    let moves = [];

    positions.forEach(p => {
      moves.push(Math.abs(p - i));
    });

    moves.forEach(m => {
      fuelUsedPerSub.push(calculateFuelUsed(m));
    });

    const fuelUsed = fuelUsedPerSub.reduce((a, c) => a + c);

    totalFuelUsed = fuelUsed < totalFuelUsed ? fuelUsed : totalFuelUsed;
  };

  return totalFuelUsed;
};

console.log("Least fuel use required: ", findLeastFuelUsed(positions));
