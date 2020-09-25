import Decimal from 'decimal.js';

const removePlus = (arrayWithPlus) => {
  let newArray = [...arrayWithPlus]
  while (newArray.indexOf('+') !== -1) {
    let indexPlus = newArray.indexOf('+')
    newArray.splice(indexPlus, 1)
  }

  return newArray
}

const sumArrayItems = (operationArrayMultiDiv) => {
  let newArray = [...operationArrayMultiDiv]
  if (newArray.length > 1) {
    if (newArray.indexOf('+') !== -1) {
      return newArray
        .filter(v => !isNaN(v))
        .reduce((prev, curr) => Decimal(prev).add(curr).toNumber())
    } else {
      return newArray.reduce((prev, curr) => Decimal(prev).add(curr).toNumber())
    }
  } else {
    return newArray[0]
  }
}

const multiplyOrDivide = (operationArrayParsed) => {

  let newArray = [...operationArrayParsed]
  let indexMul = newArray.indexOf('*')
  let indexDiv = newArray.indexOf('/')

  if (indexMul !== -1 && indexMul > indexDiv) {
    // multiply
    let currentOp = Decimal(newArray[indexMul - 1]).times(newArray[indexMul + 1]).toNumber();
    newArray.splice(indexMul - 1, 3, currentOp)
    return multiplyOrDivide(newArray)
  } else if (indexDiv !== -1 && indexDiv > indexMul) {
    // divide
    let currentOp = Decimal.div(newArray[indexDiv - 1], newArray[indexDiv + 1]).toNumber();
    newArray.splice(indexDiv - 1, 3, currentOp)
    return multiplyOrDivide(newArray)
  } else {
    return newArray
  }
}

const dashToDashOne = (operationArray) => {

  let newArray = [...operationArray]
  if (newArray.indexOf('-') !== -1) {
    // do things
    //["-",1,"-",1]
    let index = newArray.indexOf('-')
    newArray.splice(index, 1, -1, '*')
    return dashToDashOne(newArray)
  } else {
    // do things
    return newArray
  }
}

const fillOperationArray = (array1, array2) => {
  let firstArray = [...array1];
  let secondArray = [...array2];
  let resultArray = [];

  while (firstArray.length > 0) {
    resultArray.push(firstArray[0]);
    firstArray.splice(0, 1);
    if (secondArray.length > 0) {
      resultArray.push(secondArray[0]);
      secondArray.splice(0, 1);
    }
  }

  return resultArray;
}

const generateOperationArray = (opArray, numArray) => {

  if (opArray.length === 0) return numArray;

  let operationArray = [];

  if (numArray.length > opArray.length) {
    operationArray = fillOperationArray(numArray, opArray);
  } else {
    operationArray = fillOperationArray(opArray, numArray);
  }

  return operationArray;
}

const generateNumbersArray = (inputString) => {

  let stringNumArray = inputString.match(/\d[?\.|?\d]*/g);
  let numArray = stringNumArray.map(val => +val);
  return numArray;
}

const generateOperatorsArray = (inputString) => {

  let operators = inputString.match(/[*/+-]/g);
  if (operators) {
    return operators;
  } else {
    return [];
  }
}

const stringCalculator = (inputString, sequential) => {

  const opArray = generateOperatorsArray(inputString);

  const numArray = generateNumbersArray(inputString);

  const operationArray = generateOperationArray(opArray, numArray);

  const operationArrayParsed = dashToDashOne(operationArray);

  const operationArrayMultiDiv = multiplyOrDivide(operationArrayParsed);

  const result = sumArrayItems(operationArrayMultiDiv);

  return result;
}

export default stringCalculator;