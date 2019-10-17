const lastElInArray = array => array[array.length-1];

const arraysEqual = (a, b) => {   // функция для проверки одинаковы ли массивы
    return JSON.stringify(a) === JSON.stringify(b);
};

const copyArray = (copiedArr, ArrToCopy) => { // копирование массива
    copiedArr.push.apply(copiedArr, ArrToCopy);
};

let learningPace = 0.5, addersInBuriedLayer = [], activationFuncsInBuried = [], addersInOutputLayer = [], activationFuncsInOutput = [];
let inputLayer = [0.05, 0.1, 1], answerY = [0.01, 0.99];

let allWeightInInput = [
    [0.15, 0.25],
    [0.2, 0.3],
    [0.35, 0.35],
];

let allWeightInBuried = [
    [0.4, 0.5],
    [0.45, 0.55],
    [0.6, 0.6],
];


for (let i=0; i<allWeightInInput[0].length; i++) {
    let adder = inputLayer.map((value, index) => value + allWeightInInput[index][i])
        .reduce((firstValue, secondValue) => firstValue + secondValue);
    addersInBuriedLayer.push(adder);
    let funcActivation = 1 / (1 + (Math.exp(-adder)));
    activationFuncsInBuried.push(funcActivation)
}

activationFuncsInBuried.push(lastElInArray(inputLayer));

for(let i=0; i<allWeightInBuried[0].length; i++){
    let adder = activationFuncsInBuried.map((value, index) => value * allWeightInBuried[index][i])
        .reduce((firstValue, secondValue) => firstValue + secondValue);
    addersInOutputLayer.push(adder);
    let funcActivation = 1 / (1 + (Math.exp(-adder)));
    activationFuncsInOutput.push(funcActivation);
}

let functionalError, copyFunctionalError, copyAllWeightInInput = [];
do {
    functionalError = answerY.map((value, index) => value - activationFuncsInOutput[index]).map((value) => (Math.pow(value, 2)) / 2)
        .reduce((f, s) => f + s);

    let ErrDif;
    for (let key in allWeightInBuried) {
        for (let el in allWeightInBuried[key]) {
            if (key !== '0') {
                if (el === '0') {
                    ErrDif = (activationFuncsInOutput[el] - answerY[el]) * (activationFuncsInOutput[el]
                        * (1 - activationFuncsInOutput[el])) * activationFuncsInBuried[Number(el) + 1];
                }
                else {
                    ErrDif = (activationFuncsInOutput[el] - answerY[el]) * (activationFuncsInOutput[el]
                        * (1 - activationFuncsInOutput[el])) * activationFuncsInBuried[el];
                }
            }
            else {
                ErrDif = (activationFuncsInOutput[el] - answerY[el]) * (activationFuncsInOutput[el]
                    * (1 - activationFuncsInOutput[el])) * activationFuncsInBuried[el];
            }
            allWeightInBuried[key][el] += -learningPace * ErrDif;
        }
    }

    for (let key in allWeightInInput) {
        for (let el in allWeightInInput[key]) {
            ErrDif = ((activationFuncsInOutput[el] - answerY[el]) * (activationFuncsInOutput[el] * (1 - activationFuncsInOutput[el]))
                * allWeightInBuried[key][el]) * (activationFuncsInBuried[el] * (1 - activationFuncsInBuried[el])) * inputLayer[el];
            allWeightInInput[key][el] += -learningPace * ErrDif;
        }
    }
    for (let key in allWeightInInput) {
        for (let i in allWeightInInput[key]) {
            allWeightInInput[key][i] = ~~(allWeightInInput[key][i] * 1000) / 1000;
        }
    }

    copyFunctionalError = functionalError;
    copyArray(copyAllWeightInInput, allWeightInInput);
} while(arraysEqual(copyAllWeightInInput, allWeightInInput) === true || copyFunctionalError === functionalError);
console.log(allWeightInInput);
console.log(allWeightInBuried);