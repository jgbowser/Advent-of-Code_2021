const fs = require('fs');

// Part 1: convert binary diagnostics to gamma and epsilon rates, then get total power consumption
const rawDiagnostics = fs.readFileSync("./diagnostics.txt", "utf-8");
const formattedDiagnostics = rawDiagnostics.split("\n").filter(d => !!d);

const digits = formattedDiagnostics[0].length;

function getGammaRate(diagnostics) {
  let gammaRate = ""
  let currentDigit = 0;
  let ones = 0

  while (currentDigit < digits) {
    diagnostics.forEach(num => {
      if (num[currentDigit] === "1") {
        ones++
      }
    })
  
    if (ones > (diagnostics.length / 2)) {
      gammaRate += "1"
    } else {
      gammaRate += "0"
    }

    currentDigit++
    ones = 0;
  }

  return gammaRate;
}

function getEpsilonRate(gamma) {
  let epsilonRate = ""

  for(let i = 0; i < gamma.length; i++) {
    if (gamma[i] === "1") {
      epsilonRate += "0"
    } else {
      epsilonRate += "1"
    }
  }

  return epsilonRate;
}

const gammaRate = getGammaRate(formattedDiagnostics);
const epsilonRate = getEpsilonRate(gammaRate);
const powerConsumption = parseInt(gammaRate, 2) * parseInt(epsilonRate, 2);
console.log(powerConsumption);