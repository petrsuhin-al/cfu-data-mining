const checkArrayToNum = (arr, num) => { // функция для проверки есть ли 0 в массиве
    let flattenedArr = arr.reduce(function(a, b) { // разглаживаем массив
        return a.concat(b);
    });
    return flattenedArr.includes(num); // проверяем есть ли в разглаженном массиве 0
};

const typeOfTrainingSet = (set) => {  // функция определения типа чисел в обучающей выборке
    let type;
    let flag = false;
    set.find((el) => flag = el.some(elem => elem > 1 || elem < 0));
    type = (flag === true) ? "real" : "binary";
    return type;
};

const arraysEqual = (a, b) => {   // функция для проверки одинаковы ли массивы
    return JSON.stringify(a) === JSON.stringify(b);
};

const copyArray = (copiedArr, ArrToCopy) => { // копирование массива
    copiedArr.push.apply(copiedArr, ArrToCopy);
};

const getRandom = (set) => {  // формирование рандомных чисел от 0 до 1 в массив весовых коэфицентов
    let arr = [];
    for(let i=0; i<set.length; i++){  // добавляем согласно количеству элементов в обучающей выборке
        arr.push( Math.random());
    }
    return arr;
};

let numberOfClusters = 2; // количество кластеров
let learningPace= 0.6;  // темп обучения

// let trainingSet = [      // неразмеченная обучающая выборка
//     [1, 1, 0, 0], [0, 0, 0, 1], [1, 0, 0, 0], [0, 0, 1, 1],
//     [1, 0, 0, 1], [1, 0, 1, 1], [1, 0, 1, 0], [0, 0, 0, 0], [1, 1, 1, 1]
// ];

let trainingSet = [      // неразмеченная обучающая выборка
    [-2, 0], [-2, 1], [-3, 0], [4, 0], [3, 0], [0, 0], [-1, 1], [2, 6], [-2, -1], [4, 2], [-7, 11], [10, 1], [2, 7], [4, -3],
    [7, 4], [-3, 1], [-1, 13], [4, -6], [-1, -1], [-4, -2], [-2, 0], [-12, -11], [-3, -3], [-7, -7], [1, 1], [-5, 9],
    [13, -6], [-6, -3], [14, 12], [-6, 4], [0, -4], [-3, 0], [12, 12], [-7, 4], [-11, 1], [8, 13], [-8, -4], [-5, -5], [5, 2],
    [-12, 12], [10, 5]
];

let allWeight = [], copyAllWeight = [], clusterObject = {}, arrayForDistance = [], diffWeightAndSet = [], typeOfSet;

for(let i=0; i<numberOfClusters; i++){ // добавляем в массив весов коэффициенты
    allWeight.push(getRandom(trainingSet));
    clusterObject[i] = [];
}
console.log(allWeight);

typeOfSet = typeOfTrainingSet(trainingSet);
do{
    for (let i in trainingSet) {
        arrayForDistance.length = 0; // обнуляем массив для расстояний между объектом и вектором весов
        diffWeightAndSet.length = 0; // обнуляем массив для разницы между весами и выборкой
        for (let j in allWeight) {
            diffWeightAndSet[j] = trainingSet[i].map((value, index) => value - allWeight[j][index]); // считаем разницу между весами и выборкой и пушим в массив
            if (diffWeightAndSet.length === allWeight.length) { // если в массиве разниц столько же элементов сколько подмассивов в массиве весов
                for (let m in diffWeightAndSet) {  // ... то считаем расстояние между объектом и вектором весов и пушим в массив
                    arrayForDistance[m] = Math.sqrt(diffWeightAndSet[m].map((num) => Math.pow(num, 2)).reduce((firstVal, secondVal) => firstVal + secondVal));
                }
                let indexMinVal = arrayForDistance.indexOf(Math.min.apply(null, arrayForDistance)); // определяем минимальное значение в массиве расстояний
                allWeight[indexMinVal] = allWeight[indexMinVal].map((val, index) => val + (learningPace * diffWeightAndSet[indexMinVal][index])); // пересчитываем весовые коэфициенты где был min
            }
        }
    }

    learningPace /= 2; // уменьшаем темп обучения в 2 раза

    if(typeOfSet === "binary") {  // если тип чисел выборки бинарный, то округяем числа в массиве весов
        for (let key in allWeight) {
            for (let i in allWeight[key]) {
                allWeight[key][i] = ~~(allWeight[key][i] * 1000) / 1000;
            }
        }
    }

    if(typeOfSet === "real"){ // если тип чисел выборки бинарный, то копируем массив для последующего сравнения
        copyArray(copyAllWeight, allWeight);
    }
}  // критерии для останова цикла: для бинарной проверяем есть ли после итерации в массиве весов 0, для вещественной проверяем совпадает ли последний подсчитанный массив весов с подсчитанным на предыдущем шаге
while((typeOfSet === "binary" && checkArrayToNum(allWeight, 0) === false) || (typeOfSet === "real" && arraysEqual(copyAllWeight, allWeight) === true));

for (let i in trainingSet) {
    arrayForDistance.length = 0; // обнуляем массив для расстояний между объектом и вектором весов
    diffWeightAndSet.length = 0; // обнуляем массив для разницы между весами и выборкой
    for (let j in allWeight) {
        diffWeightAndSet[j] = trainingSet[i].map((value, index) => value - allWeight[j][index]); // считаем разницу между весами и выборкой и пушим в массив
        if (diffWeightAndSet.length === allWeight.length) { // если в массиве разниц столько же элементов сколько подмассивов в массиве весов
            for (let m in diffWeightAndSet) {  // ... то считаем расстояние между объектом и вектором весов и пушим в массив
                arrayForDistance[m] = Math.sqrt(diffWeightAndSet[m].map((num) => Math.pow(num, 2)).reduce((firstVal, secondVal) => firstVal + secondVal));
            }
            let indexMinVal = arrayForDistance.indexOf(Math.min.apply(null, arrayForDistance)); // определяем минимальное значение в массиве расстояний
            clusterObject[indexMinVal] += trainingSet[i] + ' ; '; // пушим в объект элемент выборки по индексу минимального элемента
        }
    }
}


console.log(typeOfSet);
console.log(clusterObject);

