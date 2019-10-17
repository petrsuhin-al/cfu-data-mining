const chunkArray = (array, chunkSize) => {
    let tempArray = [];
    while(array.length){
        tempArray.push(array.splice(0, chunkSize));
    }
    return tempArray;
};
const sumMatrix = (array) => {
    let sumArray = [];

    array.forEach(key => key.forEach((item, indexSubArr) => {
        sumArray[indexSubArr] = [];
        item.forEach((el, index) => sumArray[indexSubArr][index] = 0)
    }));

    array.forEach(key => key.forEach((item, indexSubArr) =>
        item.forEach((el, index) => sumArray[indexSubArr][index] += el)));

    return sumArray;
};
const diagonalEqualToZero = (arr) => {
    let doneArr = [];
    for (let i = 0; i < arr.length; i++) {
        doneArr[i] = [];
        for (let j = 0; j < arr[i].length; j++) {
            doneArr[i][j] = (i === j) ? 0 : arr[i][j];
        }
    }
    return doneArr;
};
const searchSubArrayInArr = (array, sampleArr, type, num) =>{
    let index, flag;
    for(let key in array){
        let i = 0;
        for(let el in array[key]){
            if(array[key][el] === sampleArr[el]){
                i++;
            }
            if(i === num){
                flag = true;
                index = key;
            }
        }
    }
    if(flag !== true){
        flag = false;
    }

    if(type === "flag"){
        return flag
    }
    else if(type === "index"){
        index++;
        return index;
    }
    else{
        console.error("error");
    }
};
const lastElInArray = array => array[array.length-1];
const bipolarEncoding = (arrayForEncoding) => {
    let doneArray = [];
    arrayForEncoding.forEach((key, index) => {
        doneArray[index] = [];
        key.forEach((elem, elemIndex) => {
            if (elem === 0) {
                doneArray[index][elemIndex] = -1
            }
            else{
                doneArray[index][elemIndex] = 1;
            }
        })
    });
    return doneArray;
};
const binaryEncoding = (arrayForEncoding) => {
    let doneArray = [];
    arrayForEncoding.forEach((key, index) => {
        if (key === 1) {
            doneArray[index] = 1
        }
        else{
            doneArray[index] = 0;
        }
    });
    return doneArray;
};
const vectorIdentifier = (arr, signOfVector, num) => {
    let binaryEncodingArr = binaryEncoding(signOfVector);
    let index;
    if(searchSubArrayInArr(arr, binaryEncodingArr, "flag", num) === true){
        index = searchSubArrayInArr(arr, binaryEncodingArr, "index", num);
        return ("Идентифицирован как " + index + " образец - " +  "["+ networkModel.samples[index-1] +"]");
    }
    else {
        return ("Образец не идентифицирован...")
    }

};
const typeError = () => console.log("Что-то не так с моделью сети...");

let networkModel = {                                                                // unidirectional - однонаправленная
    type: "bidirectional",                                                         // bidirectional - двунаправленная
    samples: [[1, -1, 1, -1], [-1, 1, -1, 1], [1, 1, 1, -1], [-1, -1, 1, -1]],
    sampleForIdent: [1, -1, -1, -1]
};

let nonChunkWeights = [], allWeights = [], sumAllWeights, signIdentVector = [];

if(networkModel.type === "unidirectional"){
    console.log("На входе однонаправленная сеть Хопфилда...");
    for(let key in networkModel.samples) {
        for(let el in networkModel.samples[key]) {
            let multiplicationMatrix = networkModel.samples[key].map(value => networkModel.samples[key][el] * value);
            nonChunkWeights.push(multiplicationMatrix) // умножаем транспонированные самплы на самплы
        }
    }

    allWeights = chunkArray(nonChunkWeights, networkModel.samples[0].length); // разбиваем на подмассивы
    sumAllWeights = diagonalEqualToZero(sumMatrix(allWeights)); // суммируем и диагональ приравниваем к 0

    do {
        let signIdentVector = [];
        for (let key in sumAllWeights) {
            let identVector = sumAllWeights[key].map((value, index) => value * networkModel.sampleForIdent[index]).reduce((a, b) => a + b);
            signIdentVector.push(Math.sign(identVector)); // умножаем массив весов на вектор который идентифицируем
        }
    } while(searchSubArrayInArr(networkModel.samples, networkModel.sampleForIdent, "flag", networkModel.sampleForIdent.length) === false);

    index = searchSubArrayInArr(networkModel.samples, networkModel.sampleForIdent, "index");
    console.log("Идентифицирован как", index, "образец -", networkModel.samples[index-1]);
}
else if(networkModel.type === "bidirectional"){
    console.log("На входе двунаправленная сеть Хопфилда...");

    let binaryRepresentation = []; // массив для двоичного представления
    for(let i = 0; i < networkModel.samples.length; i++){
        let sNumber = (i+1).toString(2); // переводим в двоичную
        binaryRepresentation[i] = []; // пушим в массив подмассив
        for(let j = 0; j < sNumber.length; j++){
            let num = +sNumber.charAt(j); // разделяем строку двочиного числа на отдельные цифры
            binaryRepresentation[i].push(num) // пушим по отдельности цифры
        }
    }

    let maxLength = lastElInArray(binaryRepresentation).length; // смотрим какая длина у последнего элемента массива двоичного представления
    for(let key in binaryRepresentation) {
        while (binaryRepresentation[key].length !== maxLength) {
            binaryRepresentation[key].unshift(0);  // в начало добавляем 0, чтоб длина была такая же как и у последнего элемента
        }
    }

    let bipolarEncodingArr = bipolarEncoding(binaryRepresentation);

    for(let key in bipolarEncodingArr) {
        for(let el in bipolarEncodingArr[key]) {
            let multiplicationMatrix = networkModel.samples[key].map(value => bipolarEncodingArr[key][el] * value);
            nonChunkWeights.push(multiplicationMatrix) // умножаем переведенные числа в биполярной системе на самплы
        }
    }

    allWeights = chunkArray(nonChunkWeights, maxLength); // разбиваем на подмассивы
    sumAllWeights = sumMatrix(allWeights); // суммируем


    for (let key in sumAllWeights) {
        let identVector = sumAllWeights[key].map((value, index) => value * networkModel.sampleForIdent[index]).reduce((a, b) => a + b);
        signIdentVector.push(Math.sign(identVector)); // умножаем массив весов на вектор который идентифицируем
    }

    if(signIdentVector.indexOf(0) > -1){
        console.log("При идентификации образца в нем был обнаружен 0 -", signIdentVector);
        console.log("Рассмотрение двух случаев...");

        let newSignIdentVectorFirst = [], newSignIdentVectorSecond = [];
        for(let key in signIdentVector){
            if(signIdentVector[key] === 0){
                newSignIdentVectorFirst.push(1);
                newSignIdentVectorSecond.push(-1);
            }
            else{
                newSignIdentVectorFirst.push(signIdentVector[key]);
                newSignIdentVectorSecond.push(signIdentVector[key]);
            }
        }
        console.log("_________________________________________");
        console.log("Пологаем 0 как 1 -", newSignIdentVectorFirst);
        console.log(vectorIdentifier(binaryRepresentation, newSignIdentVectorFirst, newSignIdentVectorFirst.length));

        console.log("_________________________________________");
        console.log("Пологаем 0 как -1 -", newSignIdentVectorSecond);
        console.log(vectorIdentifier(binaryRepresentation, newSignIdentVectorSecond, newSignIdentVectorSecond.length));

    }
    else{
        console.log(vectorIdentifier(binaryRepresentation, signIdentVector, signIdentVector.length))
    }
}
else{
    typeError();
}