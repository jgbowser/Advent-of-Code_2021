const fs = require("fs");

const data = fs.readFileSync("initialPopulation.txt", "utf-8");

// Part 1: Simulate lantern fish breeding and calculate population after 80 days
const initialPopulation = data
  .split(",")
  .filter((v) => !!v)
  .map((v) => parseInt(v));

function simulateBreeding(initialPop, cycles) {
  let fish = initialPop;
  let newFish = 0;

  for(let i = 0; i < cycles; i++) {
    let cycleResult = [];

    for(let j = 0; j < fish.length; j++) {
      if (fish[j] === 0) {
        newFish++
        cycleResult.push(6);
      } else {
        cycleResult.push(fish[j] - 1)
      }
    }

    for(let k = 0; k < newFish; k++) {
      cycleResult.push(8);
    }

    fish = cycleResult;
    cycleResult = [];
    newFish = 0;
  }

  return fish;
}

console.log(simulateBreeding(initialPopulation, 80).length);
