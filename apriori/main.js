    "use strict";

    function matchCheck(array, object){  // функци для подсчета повторяющихся элементов и записи их в объект
        let num = array;
        object[num] = object[num] ? object[num] + 1 : 1;
    }

    function printPermutations(array, k){ // функция формирования пар
        let combinations = [];
        let indices = [];
        function next(index) {
            if (index === k) {
                let result = [];
                for (let i = 0; i < k; i++) {
                    result[i] = array[indices[i]];
                }
                combinations.push(result);
                return;
            }
            for (let i = 0; i < array.length; i++) {
                if (alreadyInCombination(i, index)) // исключаем те элементы массива, которые уже входят в формируемую комбинацию
                    continue;
                indices[index] = i; // сохраняем зафиксированный элемент в конбинацию
                next(index + 1); // для каждого неисключенного делаем рекурсивный вызов с позицией + 1
            }
        }
        function alreadyInCombination(i, index) { // функция исключения элементов массива которые входят в формируемую комбинацию
            for (let j = 0; j < index; j++) {
                if (indices[j] === i) {
                    return true;
                }
            }
            return false;
        }
        next(0);
        return combinations;
    }
    

    function arrSort(array){    // сортировка массива
        function sIncrease(i, ii) { // по возрастанию
            if (i > ii)
                return 1;
            else if (i < ii)
                return -1;
            else
                return 0;
        }
        for(let i=0; i<array.length; i++) {
            array[i].sort(sIncrease);
        }
        return array;
    }

    function subarraySmoothing(array) {  // функция сглаживания подмассивов подмассива
        let smoothingArr = [];
        for(let i=0; i<array.length; i++){
            let subArr = [].concat(array[i][0], array[i][1]);
            smoothingArr.push(subArr)
        }
        return smoothingArr;
    }

    function uniqueNum(arrayUni, arrayNonUni){ // функция для удаления повторяющихся элементов внутри подмассива
        arrayUni.push(arrayNonUni.filter(function (elem, index, self) {
            return index === self.indexOf(elem);
        }))
    }

    function deleteBadSubarray(array, n) {   // удаляем не подходящие склейки
        let goodArr = [];
        for(let i=0; i<array.length; i++){
            if (array[i].length === n){
                goodArr.push(array[i]);
            }
        }
        return goodArr;
    }

    function checkSupport(object){
        for(let key in object) {  // берем ключи тех свойст что больше двух (свойства - элементы транзакции, ключи - количество их повторений)
            if(object[key] >= support) {
                return true
            }
            else{
                return false;
            }
        }
    }

    function combinationsInArray(object, array){
        for(let key in object){  // берем ключи тех свойст что больше двух (свойства - элементы транзакции, ключи - количество их повторений)
            if (object[key] >= support) {
                let customKey = key.replace(/^"(.+(?="$))"$/, '$1'); // убираем кавычки
                array.push.apply(array, [customKey.split(",").map(Number)]);
            }
        }
    }


    let support = 2, quantityEl = 3;
    let objectCountRepeat = {}, itemSatisfySupport = [];
    let arrayUniqueNum = [], smothArr = [], gluedEl = [], doneArrEl;

    let allTransactions = [
        [1, 2, 3, 4, 5, 6, 8],
        [9, 1, 10, 11, 12],
        [11, 6, 13, 2, 5],
        [14, 9, 15, 16, 17],
        [5, 3, 6, 18],
        [19, 5, 6, 18, 17],
        [5, 6, 4]
    ];

    // ПЕРВАЯ ИТЕРАЦИЯ
    for(let i=0; i<allTransactions.length; i++){ // циклы создания объекта из массива транзакций в количество повторяющихся элементов
       for(let j=0; j<allTransactions[i].length; j++) {
           matchCheck(allTransactions[i][j], objectCountRepeat)
       }
    }
    // ТЕПЕРЬ У НАС ЕСТЬ ОБЪЕКТ С КОЛИЧЕСТВОМ ПОВТОРЯЮЩИХСЯ ТРАНЗАКЦИЙ

    for(let key in objectCountRepeat){  // берем ключи тех свойст что больше двух (свойства - элементы транзакции, ключи - количество их повторений)
        if (objectCountRepeat[key] >= support) {
                itemSatisfySupport.push(parseFloat(key));
        }
    }
    // ВЗЯЛИ ТЕ ЧТО БОЛЬШЕ ИЛИ РАВНЫ SUPPORT

    doneArrEl = uniqBy(arrSort(printPermutations(itemSatisfySupport, 2)), JSON.stringify); // на выходе получаем уникальные склейки из двух элементов траназакции
    // ПРОВЕЛИ ПЕРВУЮ ИТЕРАЦИЮ И ПОЛУЧИЛИ ПЕРВЫЕ СКЛЕЙКИ ПО 2 ЭЛЕМЕНТА

    objectCountRepeat ={};  // удаляем значения из объекта для повторного использования
    for (let j = 0; j < allTransactions.length; j++) {  // формируем объект
        for (let i = 0; i < doneArrEl.length; i++) {  // проверяем есть ли подмассив склейки в подмассивах всех транзакций
            if(doneArrEl[i].every(function (doneArrEl) {
                return allTransactions[j].indexOf(doneArrEl) > -1;
            })){
                matchCheck(doneArrEl[i], objectCountRepeat)
            }
        }
    }

    do{
        itemSatisfySupport.length = 0; // обнуляем длину массива склеенных элементов транзакции для повторного использования
        combinationsInArray(objectCountRepeat, itemSatisfySupport);

        gluedEl.length = 0;
        gluedEl = printPermutations(itemSatisfySupport, 2);// получаем массив из четырех уникальных элементов транзакции

        smothArr.length = 0;
        smothArr = subarraySmoothing(gluedEl);

        arrayUniqueNum.length = 0;
        for(let i=0; i<smothArr.length; i++) {  // удаляем  повторяющиеся элементы в подмассиве
            uniqueNum(arrayUniqueNum, smothArr[i]);
        }

        doneArrEl.length = 0;
        doneArrEl = uniqBy(arrSort(deleteBadSubarray(arrayUniqueNum, quantityEl)), JSON.stringify);
        quantityEl += 1;

        objectCountRepeat ={};  // удаляем значения из объекта для повторного использования
        for (let j = 0; j < allTransactions.length; j++) {  // формируем объект
            for (let i = 0; i < doneArrEl.length; i++) {  // проверяем есть ли подмассив склейки в подмассивах всех транзакций
                if(doneArrEl[i].every(function (doneArrEl) {
                    return allTransactions[j].indexOf(doneArrEl) > -1;
                })){
                    matchCheck(doneArrEl[i], objectCountRepeat)
                }
            }
        }

        combinationsInArray(objectCountRepeat, itemSatisfySupport);
    }
    while(checkSupport(objectCountRepeat) === true);{
        console.log(itemSatisfySupport);
    }