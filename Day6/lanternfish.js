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

  for (let i = 0; i < cycles; i++) {
    let cycleResult = [];

    for (let j = 0; j < fish.length; j++) {
      if (fish[j] === 0) {
        newFish++;
        cycleResult.push(6);
      } else {
        cycleResult.push(fish[j] - 1);
      }
    }

    for (let k = 0; k < newFish; k++) {
      cycleResult.push(8);
    }

    fish = cycleResult;
    cycleResult = [];
    newFish = 0;
  }

  return fish;
}

console.log(simulateBreeding(initialPopulation, 80).length);

// Part 2: assuming they live forever, how many after 256 days
// the solution to part 1 doesn't work here because it exceeds the javascript heap allocation
// after plenty of brainstorming I looked to other solutions for some hints.
// the trick is to not keep track of individual fish, but of the number of fish at each period
// in their breeding cycle. There are 9 possible stages (0 - 8 days til spawn)
// Use an array of length 9, with each index being the day til spawn and the value the number of fish
// loop through however many days are being simulated, shifting the day 0 fish from the front
// add that number to position 6 (adults take 6 days to spawn again) and push that number to the end 
// (new born fish require 2 extra days before a spawn)

function simulateBreeding2(initialPop, days) {
  // create an array to track the # of fish in each cycle, then increment each cycle using the given data
  const fishPerCycle = new Array(9).fill(0);
  initialPop.forEach(fish => fishPerCycle[fish]++);
  
  for(let i = 0; i < days; i++) {
    // get the number of fish at cycle day 0. each will spawn a new fish
    const spawningFish = fishPerCycle.shift();
    // the fish that just spawned have 6 days until their next spawn
    fishPerCycle[6] += spawningFish;
    // for every fish that just spawned 1 new fish is added to the end of the spawn cycle array
    fishPerCycle.push(spawningFish);
  }

  return fishPerCycle;
}
console.log(simulateBreeding2(initialPopulation, 256).reduce((a, c) => a + c));
