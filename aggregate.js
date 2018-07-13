const fs = require("fs");

const aggregate = (filePath) => {
  const FILE = "countriesmap.txt";
  const FILE1 = filePath;
  const readCountryFilePromise = () => {
    return new Promise((resolve, reject) => {
      fs.readFile(FILE1, 'utf8', (err, data) => {
        if (err) reject(err);
        else
          resolve(data);
      });
    });
  };
  const readDataFilePromise = () => {
    return new Promise((resolve, reject) => {
      fs.readFile(FILE, 'utf8', (err, data) => {
        if (err) reject(err);
        else
          resolve(data);
      });
    });
  };

  Promise.all([readCountryFilePromise(), readDataFilePromise()]).then((values) => {
    let data1 = values[1];
    let data = values[0];
    //  console.log(data);
    let countryObjects;
    const countryMap = [];
    const dataString = data.toString();
    const splitData = dataString.split('\n');
    const headers = splitData[0].split(',');
    for (let i = 0; i < headers.length; i += 1) {
      headers[i] = headers[i].replace(/['"]+/g, '');
    }
    for (let i = 1; i < splitData.length; i += 1) {
      const cleanData = splitData[i].split(',');
      for (let k = 0; k < cleanData.length; k += 1) {
        cleanData[k] = cleanData[k].replace(/['"]+/g, '');
      }
      countryObjects = {};
      for (let j = 0; j < cleanData.length; j += 1) {
        countryObjects[headers[j]] = cleanData[j];
      }
      countryMap.push(countryObjects);
    }
    // console.log(countryMap);
    const splitString = data1.split('\n');
    let splitByComma;
    const countryContinentMap = new Map();
    for (let i = 0; i < splitString.length; i += 1) {
      splitByComma = splitString[i].split(',');
      splitByComma[1] = splitByComma[1].replace(/\r/g, '');
      countryContinentMap.set(splitByComma[0], splitByComma[1]);
    }
    // console.log(countryContinentMap);
    const conti = [];

    for (let i = 0; i < countryMap.length; i += 1) {
      if (countryMap[i]['Country Name'] !== 'European Union') {
        countryMap[i].continent = countryContinentMap.get(countryMap[i]['Country Name']);
        conti.push(countryContinentMap.get(countryMap[i]['Country Name']));
      }
    }
    const continent = new Set(conti);
    const contiSplitData = [...continent];
    contiSplitData.splice(6, 1);
    const finalSplitData = [];
    const countryObjectsectdefined = {};
    for (let i = 0; i < contiSplitData.length; i += 1) {
      let sumPopulation = 0;
      let sumGDP = 0;
      for (let j = 0; j < countryMap.length; j += 1) {
        if (contiSplitData[i] === countryMap[j].continent) {
          sumPopulation += parseFloat(countryMap[j]['Population (Millions) - 2012']);
          sumGDP += parseFloat(countryMap[j]['GDP Billions (US Dollar) - 2012']);
        }
      }
      const name = {};
      name.GDP_2012 = sumGDP;
      name.POPULATION_2012 = sumPopulation;
      finalSplitData.push(name);
    }
    for (let i = 0; i < contiSplitData.length; i += 1) {
      countryObjectsectdefined[contiSplitData[i]] = finalSplitData[i];
    }
    fs.writeFileSync('./output/output.json', JSON.stringify(countryObjectsectdefined));

  });
}

module.exports = aggregate;
