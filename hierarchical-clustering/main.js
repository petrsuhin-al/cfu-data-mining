const lastElInArray = array => array[array.length-1];
const indexLastEl = array => array.length-1;
let calcDistance = (firstX, secondX, firstY, secondY) => Math.sqrt(Math.pow((firstX - secondX), 2) + Math.pow((firstY - secondY), 2));
const removeInArr = (arr, ...args) => {  // функция удаления из массива по индексам
    let set = new Set(args);
    return arr.filter((v, k) => !set.has(k));
};
const mergeSubArrays = (input) => {
    let numberGroup = {};
    let neighbors = new Array(input.length);
    let processed = new Array(input.length);

    input.forEach((element, arrayIndex) => {
        let array = input[arrayIndex];
        neighbors[arrayIndex] = {};
        processed[arrayIndex] = false;

        array.forEach((j, i) => {
            let number = array[i];

            if (numberGroup.hasOwnProperty(number) === false) {
                numberGroup[number] = arrayIndex;
            }
            else {
                let neighbor = numberGroup[number];
                neighbors[arrayIndex][neighbor] = true;
                neighbors[neighbor][arrayIndex] = true;
            }
        });
    });

    let makeGroup = (index, group) => {
        if (processed[index] === false) {
            processed[index] = true;
            for(let i in input[index]){
                group[input[index][i]] = true;
            }

            for (let neighbor in neighbors[index]) makeGroup(neighbor, group)
            return true; // this makes a new group
        }
        return false; // this does not make a new group
    };

    let result = [];

    input.forEach((elem, i) => {
        let group = {};
        if(makeGroup(i, group)) {
            result.push(Object.keys(group).map(Number).sort((a, b) => a - b)); // pass the keys to an array and sort it
        }
    });

    return result;
};

class storeCoordinate {  // класс для массива координат начальных точек
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let allDots = [];
allDots.push(new storeCoordinate(0.4, 0.53));
allDots.push(new storeCoordinate(0.22, 0.38));
allDots.push(new storeCoordinate(0.35, 0.32));
allDots.push(new storeCoordinate(0.26, 0.19));
allDots.push(new storeCoordinate(0.08, 0.41));
allDots.push(new storeCoordinate(0.45, 0.3));

let matrix = [];

for(let elem in allDots) {
    let subArr =[];
        for (let key in allDots) {
            if(Number(key) === Number(elem) + 1) break;
            subArr.push(calcDistance(allDots[elem].x, allDots[key].x, allDots[elem].y, allDots[key].y))
        }
    matrix.push(subArr)
}

let task = [];
do {
    let lastEl = lastElInArray(matrix);
    lastEl = removeInArr(lastEl, indexLastEl(lastEl));

    let minValue = Math.min.apply(null, lastEl);
    let indexOfSelectedElem = lastElInArray(matrix).indexOf(minValue);
    let indexOfLastElem = indexLastEl(matrix);

    matrix.forEach((value, index) => (indexOfSelectedElem > index)
        ? matrix[indexOfSelectedElem][index] = Math.max(matrix[indexOfSelectedElem][index], matrix[indexOfLastElem][index])
        : matrix[index][indexOfSelectedElem] = Math.max(matrix[index][indexOfSelectedElem], matrix[indexOfLastElem][index])
    );

    let select = indexOfSelectedElem + 1;
    let last = indexOfLastElem + 1;
    task.push([last, select]);
    matrix = removeInArr(matrix, indexOfLastElem);
} while(matrix.length !== 2);

task = mergeSubArrays(task);
console.log(task);