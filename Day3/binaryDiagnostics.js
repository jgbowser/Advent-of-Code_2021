const fs = require('fs');

// Part 1: convert binary diagnostics to gamma and epsilon rates, then get total power consumption
const rawDiagnostics = fs.readFileSync("./diagnostics.txt", "utf-8");
// format raw data into an array, ensure there are no empty values
const formattedDiagnostics = rawDiagnostics.split("\n").filter(d => !!d);

// get the number of digits in a diagnostic code
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
console.log("Power consumption: ", powerConsumption);

// Part 2: Oxygen rating and CO2 Scrubber rating

function getFilterBit(data, currentBit, rating) {
  let ones = 0;
  let zeros = 0;
  let filterBit;
  for (let i = 0; i < data.length; i++) {
    if (data[i][currentBit] === "1") {
      ones++
    } else {
      zeros++
    }
  }
  // Filter bit for oxygen is most common value, or 1 if equal
  if (rating === "O2") {
    filterBit = zeros === ones ? "1" : zeros > ones ? "0" : "1";
  }
  // Filter bit for CO2 is least common value, or 0 if equal
  if (rating === "CO2") {
    filterBit = zeros === ones ? "0" : zeros > ones ? "1" : "0";
  }

  return filterBit;
}

function getSystemRating(diagnostics, rating) {
  let filteredValues = diagnostics;
  let currentBit = 0;

  while (filteredValues.length > 1) {
    let filterBit = getFilterBit(filteredValues, currentBit, rating);
    filteredValues = filteredValues.filter(value => value[currentBit] === filterBit);
    currentBit++
  }

  return filteredValues[0];
}

const O2Rating = getSystemRating(formattedDiagnostics, "O2");
const CO2Rating = getSystemRating(formattedDiagnostics, "CO2");

const lifeSupportRating = parseInt(O2Rating, 2) * parseInt(CO2Rating, 2);

console.log("Life support rating: ", lifeSupportRating);