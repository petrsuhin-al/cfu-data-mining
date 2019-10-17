const arraysEqual = (a, b) => {   // функция для проверки одинаковы ли массивы
    return JSON.stringify(a) === JSON.stringify(b);
};

const copyArray = (copiedArr, ArrToCopy) => { // копирование массива
    copiedArr.push.apply(copiedArr, ArrToCopy);
};

let trainingSet = [     // обучающая выборка
    {'set': [-2, 0, 1], 'state': 1},
    {'set': [-2, 1, 1], 'state': 1},
    {'set': [-3, 0, 1], 'state': 1},
    {'set': [4, 0, 1], 'state': -1},
    {'set': [3, 0, 1], 'state': -1},
    {'set': [0, 0, 1], 'state': 1},
    {'set': [-1, 1, 1], 'state': 1},
    {'set': [2, 6, 1], 'state': -1},
    {'set': [-2, -1, 1], 'state': 1},
    {'set': [4, 2, 1], 'state': -1},
    {'set': [-7, 11, 1], 'state': 1},
    {'set': [10, 1, 1], 'state': -1},
    {'set': [2, 7, 1], 'state': -1},
    {'set': [4, -3, 1], 'state': -1},
    {'set': [7, 4, 1], 'state': -1},
    {'set': [-3, 1, 1], 'state': 1},
    {'set': [-1, 13, 1], 'state': -1},
    {'set': [4, -6, 1], 'state': -1},
    {'set': [-1, -1, 1], 'state': 1},
    {'set': [-4, -2, 1], 'state': 1},
    {'set': [-2, 0, 1], 'state': 1},
    {'set': [-12, -11, 1], 'state': 1},
    {'set': [-3, -3, 1], 'state': 1},
    {'set': [-7, -7, 1], 'state': 1},
    {'set': [1, 1, 1], 'state': -1},
    {'set': [-5, 9, 1], 'state': 1},
    {'set': [13, -6, 1], 'state': -1},
    {'set': [-6, -3, 1], 'state': 1},
    {'set': [14, 12, 1], 'state': -1},
    {'set': [-6, 4, 1], 'state': 1},
    {'set': [0, -4, 1], 'state': 1},
    {'set': [-3, 0, 1], 'state': 1},
    {'set': [12, 12, 1], 'state': -1},
    {'set': [-7, 4, 1], 'state': 1},
    {'set': [-11, 1, 1], 'state': 1},
    {'set': [8, 13, 1], 'state': -1},
    {'set': [-8, -4, 1], 'state': 1},
    {'set': [-5, -5, 1], 'state': 1},
    {'set': [5, 2, 1], 'state': -1},
    {'set': [-12, 12, 1], 'state': 1},
    {'set': [10, 5, 1], 'state': -1},
];

//let newSet = [{'set': [5.1, 3.5, 1], 'state': 1}];

let allWeight = [], learningPace = Math.random(), copyAllWeight = []; // массив весовых коэффициентов и темпа обучения
let classObj = {"class -1": '', "class +1": ''};

for(let i=0; i<trainingSet[0].set.length; i++){
    allWeight.push(Math.random()); // пушим столько весов сколько элементов в set
}

let check = 0;
do {
    for (let key in trainingSet) {
        let func = trainingSet[key].set.map(((value, index) => value * allWeight[index])).reduce((firstValue, secondValue) => firstValue + secondValue); // считаем уравнение
        let signFunc = Math.sign(func); // берем знак от полученного
        if (signFunc !== trainingSet[key].state) { // если знак не совпадает то ...
            for (let el in allWeight) {
                allWeight[el] += (learningPace * (trainingSet[key].state - signFunc) * trainingSet[key].set[el]); // ... пересчитываем весовые коэффициенты
            }
        }
        else {
            console.log("all ok");
            check += 1;
        }
    }
    copyArray(copyAllWeight, allWeight);
}
while(check === trainingSet.length || arraysEqual(copyAllWeight, allWeight) === true);

for(let key in trainingSet){
    let func = trainingSet[key].set.map((value, index) => value * allWeight[index]).reduce((firstValue, secondValue) => firstValue + secondValue);
    let signFunc = Math.sign(func);
    if(signFunc === -1){
        classObj["class -1"] += trainingSet[key].set + " ; ";
    }
    else {
        classObj["class +1"] += trainingSet[key].set + " ; ";
    }
}

// if(newSet.length !== 0){
//     for(let key in newSet){
//         let func = newSet[key].set.map((value, index) => value * allWeight[index]).reduce((firstValue, secondValue) => firstValue + secondValue);
//         let signFunc = Math.sign(func);
//         if(signFunc === -1){
//             classObj["class -1"] += newSet[key].set + " ; ";
//         }
//         else {
//             classObj["class +1"] += newSet[key].set + " ; ";
//         }
//     }
// }

console.log(classObj);
