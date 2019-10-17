class storeLinks {
    constructor(inputLinks, outputLinks) {
        this.inputLinks = inputLinks;
        this.outputLinks = outputLinks;
    }
};
let takeOutputLinks = (arr) => {
    let doneList = [];
    for(let key in arr){
        if (arr.hasOwnProperty(key)) {
            doneList.push(arr[key].outputLinks)
        }
    }
    return doneList;
};
let matrixArrayWithSelectDiagonal = (rows,columns) => {
    let arr = [];
    for(let i=0; i<rows; i++){
        arr[i] = [];
        for(let j=0; j<columns; j++){
            arr[i][j] = (i === j) ? 1 : 0;//вместо i+j+1 пишем любой наполнитель. В простейшем случае - null
        }
    }
    return arr;
};
let calcRanks = (inputLinks, outputLinks, arrayForChanges, selectRow) => {
    let index;
    let type = (inputLinks) ? ((inputLinks.constructor === Array) ? "Array" : "Number") : "None";

    switch (type) {
        case "None":
            break;

        case "Array":
            inputLinks.forEach((elem, key) => {
                index = Number(inputLinks[key]) - 1;
                arrayForChanges[selectRow][index] = 1/outputLinks[index];
            });
            break;

        case "Number":
            index = inputLinks - 1;
            arrayForChanges[selectRow][index] = 1 / outputLinks[index];
            break;
    }
    return arrayForChanges;
};
let matrixMultByNumber = (number, matrix) => {
    let doneArr = [];
    matrix.forEach((elem, i) => {
        doneArr[i] = [];
        elem.forEach((value, j) => {
            doneArr[i][j] = number * value
        });
    });
    return doneArr;
};
let matrixArray = (rows, columns) => {
    let arr = [];
    for(let i=0; i<rows; i++){
        arr[i] = [];
        for(let j=0; j<columns; j++){
            arr[i][j] = 0;//вместо i+j+1 пишем любой наполнитель. В простейшем случае - null
        }
    }
    return arr;
};
const SumMatrix = (A,B) => {
    let m = A.length, n = A[0].length, C = [];
    for (let i = 0; i < m; i++) {
        C[i] = [];
        for (let j = 0; j < n; j++) C[i][j] = A[i][j]+B[i][j];
    }
    return C;
}
const methodGauss = (array) => {
    let standardLength = array.length;
    let m = new Array(standardLength); //Определение рабочего массива
    let doneArr = new Array(standardLength); //Массив ответов
    let k;        //Вспомогательные переменные
    for (let i = 0; i < standardLength; ++i) {
        m[i] = new Array(standardLength);
        doneArr[i] = new Array(standardLength);
    }

    for (let i = 0; i < standardLength; ++i) { //Заполнение матрицы
        for (let j = 0; j <= standardLength; ++j) {
            m[i][j] = array[i][j]
        }
    }

    Iteration(standardLength);
    Answers();

    function Iteration(iter_item) { //Функция итеррация
        for (iter_item = 0; iter_item < (standardLength - 1); iter_item++) { //Цикл выполнения итерраций
            if (m[iter_item][iter_item] === 0) SwapRows(iter_item); //Проверка на ноль
            for (let j = standardLength; j >= iter_item; j--) {
                m[iter_item][j] /= m[iter_item][iter_item]; //Делим строку i на а[i][i]
            }
            for (let i = iter_item + 1; i < standardLength; i++) { //Выполнение операций со строками
                for (let j = standardLength; j >= iter_item; j--) {
                    m[i][j] -= m[iter_item][j] * m[i][iter_item];
                }
            }
        }
    }

    function SwapRows(iter_item) { //Функция перемены строк
        for (let i = iter_item + 1; i < standardLength; i++) {
            if (m[i][iter_item] !== 0) {
                for (let j = 0; j <= standardLength; j++) {
                    k = m[i - 1][j];
                    m[i - 1][j] = m[i][j];
                    m[i][j] = k;
                }
            }
        }
    }

    function Answers() { //Функция поиска и вывода корней
        doneArr[allLinks.length - 1] = m[allLinks.length - 1][allLinks.length] / m[allLinks.length - 1][allLinks.length - 1];
        for (let i = allLinks.length - 2; i >= 0; i--) {
            k = 0;
            for (let j = allLinks.length - 1; j > i; j--) {
                k = (m[i][j] * doneArr[j]) + k;
            }
            doneArr[i] = m[i][allLinks.length] - k;
        }
        //console.log(doneArr)
    }

    return doneArr
};

let allLinks = [], d = 0.85;
allLinks.push(new storeLinks(null, 2));
allLinks.push(new storeLinks(1, 2));
allLinks.push(new storeLinks(2, 1));
allLinks.push(new storeLinks(5, 1));
allLinks.push(new storeLinks([1, 2, 3, 4], 1));

let unitMatrix = matrixArrayWithSelectDiagonal(allLinks.length, allLinks.length);
let ranksArray = matrixArray(allLinks.length, allLinks.length);

let outputLinksVar = takeOutputLinks(allLinks);
for(let key in allLinks){
    ranksArray = calcRanks(allLinks[key].inputLinks, outputLinksVar, ranksArray, key)
}

ranksArray = matrixMultByNumber(-d, ranksArray);
ranksArray = SumMatrix(unitMatrix, ranksArray);

for(let key in ranksArray){
    ranksArray[key].push(1-d)
}

ranksArray = methodGauss(ranksArray);

console.log(ranksArray);
