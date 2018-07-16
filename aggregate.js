const fs = require('fs');

const mapperFilePath = 'countryContinentJsonFile.json';
const outputFile = './output/output.json';
// write file using async method and return a promise
function writeFile(filePath, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (error) => {
      if (error === null) {
        resolve(data);
      } else {
        reject(error);
      }
    });
  });
}


// read file using async method and return a promise
const readFilePromise = function functionName(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};
// aggregate is a promise which is fulfilled when write async is complete
const aggregate = filePath => new Promise((resolve, reject) => {
  Promise.all([readFilePromise(filePath), readFilePromise(mapperFilePath)]).then((values) => {
    const mapperdata = JSON.parse(values[1]);
    const csvFileData = values[0];
    const csvProcessedData = csvFileData.replace(/['"]+/g, '').split('\n');
    // console.log(csvProcessedData);
    const headers = csvProcessedData.shift().split(',');
    // console.log(csvProcessedData);
    const getIndexOfCountryName = headers.indexOf('Country Name');
    const getIndexOfGdp2012 = headers.indexOf('GDP Billions (US Dollar) - 2012');
    const getIndexOfPopulation2012 = headers.indexOf('Population (Millions) - 2012');
    // console.log(getIndexOfCountryName, getIndexOfGdp2012, getIndexOfPopulation2012);
    // console.log(csvProcessedData[1]);
    const aggregateContinentData = {};
    csvProcessedData.forEach((row) => {
      const cells = row.split(',');
      // console.log(mapperdata[cells[getIndexOfCountryName]]);
      // console.log('this is undefined');
      if (mapperdata[cells[getIndexOfCountryName]] !== undefined) {
        const nameOfContinent = mapperdata[cells[getIndexOfCountryName]];
        // console.log(nameOfContinent);
        if (aggregateContinentData[nameOfContinent] === undefined) {
          aggregateContinentData[nameOfContinent] = {};
          aggregateContinentData[nameOfContinent].GDP_2012 = parseFloat(cells[getIndexOfGdp2012]);
          aggregateContinentData[nameOfContinent]
            .POPULATION_2012 = parseFloat(cells[getIndexOfPopulation2012]);
        } else {
          aggregateContinentData[nameOfContinent].GDP_2012 += parseFloat(cells[getIndexOfGdp2012]);
          aggregateContinentData[nameOfContinent]
            .POPULATION_2012 += parseFloat(cells[getIndexOfPopulation2012]);
          // console.log(cells[getIndexOfGdp2012]);
        }
      }
    });
    // console.log(aggregateContinentData);
    writeFile(outputFile, JSON.stringify(aggregateContinentData)).then(() => {
      resolve();
    }).catch((error) => {
      reject(error);
    });
  }).catch((error) => {
    reject(error);
  });
});
module.exports = aggregate;
