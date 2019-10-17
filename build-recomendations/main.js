 "use strict";

 const removeByAttr = (array, attr, value) => {  // функция удаления из массива объекта по атрибуту
     let i = array.length;
     while(i--){
         if( array[i] && array[i].hasOwnProperty(attr) && (arguments.length > 2 && array[i][attr] === value ) ){
             array.splice(i,1);
         }
     }
     return array;
 };

 const createObjectWithKeys = (arrayOfNum, arrayWhereKeys) => {
     let keys;
     let doneObj = {};
     for(let key in arrayWhereKeys){
         keys = Object.keys(arrayWhereKeys[key].evaluations);
     }
     for(let i=0; i<arrayOfNum.length; i++){
         doneObj[keys[i]] = arrayOfNum[i];
     }
     return doneObj;
 };

 const sortObject = (obj) => {
     let arr = [];
     for (let prop in obj) {
         if (obj.hasOwnProperty(prop)) {
             arr.push({
                 'key': prop,
                 'value': obj[prop]
             });
         }
     }
     arr.sort((a, b) =>  b.value - a.value);
     return arr;
 };

 class storeUsers {  // класс для объекта имени юзера и принадлежащих оценок соответственно
     constructor(name, evaluations) {
         this.name = name;
         this.evaluations = evaluations;
     }
 }

 class storeEvaluations {  // класс для добавления объекта оценок к юзеру
     constructor(firstItem, secondItem, thirdItem, fourthItem, fifthItem, sixthItem, seventhItem, eighthItem, ninthItem) {
         this.first = firstItem;
         this.second = secondItem;
         this.third = thirdItem;
         this.fourth = fourthItem;
         this.fifth = fifthItem;
         this.sixth = sixthItem;
         this.seventh = seventhItem;
         this.eighth = eighthItem;
         this.ninth = ninthItem;
     }
 }

 class storeEvaluationsSelectUsers {  // класс для добавления объекта оценок к юзеру
     constructor(namePrimaryUser, firstEv, secondEv) {
         this.namePrimaryUser = namePrimaryUser;
         this.firstEv = firstEv;
         this.secondEv = secondEv;
     }
 }

 let goodsEvaluations = []; // массив всех юзеров
 goodsEvaluations.push(new storeUsers('Alex', new storeEvaluations(5, 3, null, null, 4, null, null, null, null)));
 goodsEvaluations.push(new storeUsers('Ivan', new storeEvaluations(4, 3, null, null, null, 1, null, 2, 3)));
 goodsEvaluations.push(new storeUsers('Bob', new storeEvaluations(null, 5, 5, null, null, null, null, null, null)));
 goodsEvaluations.push(new storeUsers('David', new storeEvaluations(null, null, 4, 3, null, 2, 1, null, null)));
 goodsEvaluations.push(new storeUsers('Boris', new storeEvaluations(null, 5, 6, null, null, null, null, 1, null)));
 goodsEvaluations.push(new storeUsers('John', new storeEvaluations(null, null, null, null, null, 5, null, null, 1)));
 goodsEvaluations.push(new storeUsers('James', new storeEvaluations(null, null, 1, null, null, 3, null, null, null)));
 goodsEvaluations.push(new storeUsers('Chris Brown', new storeEvaluations(5, null, null, null, null, 5, null, null, 1)));
 goodsEvaluations.push(new storeUsers('Lil Yachty', new storeEvaluations(5, null, null, 2, 3, null, null, 5, null)));
 goodsEvaluations.push(new storeUsers('Vee', new storeEvaluations(2, 5, null, null, null, 1, null, null, 5)));
 goodsEvaluations.push(new storeUsers('Post Malone', new storeEvaluations(5, 4, 4, 5, 1, 2, 5, 2, 2)));
 goodsEvaluations.push(new storeUsers('Timberlake', new storeEvaluations(null, null, 3, null, 2, 1, null, null, 5)));

 let selectUserEvaluations = []; // массив выбранного юзера
 for(let key in goodsEvaluations){  // добавляем выбранного юзера с оценками в новый массив и удаляем из старого
     if (goodsEvaluations[key].name === 'Ivan') {
         selectUserEvaluations.push(new storeUsers(goodsEvaluations[key].name, goodsEvaluations[key].evaluations));
         removeByAttr(goodsEvaluations, 'name', 'Ivan')

     }
 }

 let arrayOfSelectUserEval = []; // добавляем оценки выбранного юзера в массив
 for (let i in selectUserEvaluations) {
     for (let key in selectUserEvaluations[i].evaluations) {
         if (selectUserEvaluations[i].evaluations[key] !== null) {
             arrayOfSelectUserEval.push(selectUserEvaluations[i].evaluations[key]);
         }
     }
 }

 let y = Math.sqrt(arrayOfSelectUserEval.map((num) => Math.pow(num, 2)).reduce((a, b) => a + b)); // считаем ||y|| в знаменателе

 let usersIdenticalPurchases = [];
 let updateGoodsEvaluations = [];
 let sumOfIdenticalPurchases = {};
 let namesUsersOfSum = [];
 for (let i in goodsEvaluations) {
     for (let key in goodsEvaluations[i].evaluations) {
         if(goodsEvaluations[i].evaluations[key] !== null && selectUserEvaluations[0].evaluations[key] !== null) {
             if(namesUsersOfSum.indexOf(goodsEvaluations[i].name) > -1){
                 sumOfIdenticalPurchases[goodsEvaluations[i].name] += goodsEvaluations[i].evaluations[key] * selectUserEvaluations[0].evaluations[key];
             }
             else{
                 sumOfIdenticalPurchases[goodsEvaluations[i].name] = goodsEvaluations[i].evaluations[key] * selectUserEvaluations[0].evaluations[key];
                 namesUsersOfSum = Object.keys(sumOfIdenticalPurchases);
                 usersIdenticalPurchases.push(new storeUsers(goodsEvaluations[i].name, Object.values(goodsEvaluations[i].evaluations)));
                 updateGoodsEvaluations.push(new storeUsers(goodsEvaluations[i].name, goodsEvaluations[i].evaluations));
             }
         }
     }
 }

 let cosineMeasure = {};
 for(let i in sumOfIdenticalPurchases){  // вычисляем косинусные меры
     for(let key in usersIdenticalPurchases){
         let x = Math.sqrt(usersIdenticalPurchases[key].evaluations.map((num) => Math.pow(num, 2)).reduce((a, b) => a + b));
     cosineMeasure[usersIdenticalPurchases[key].name] = sumOfIdenticalPurchases[i] / (x * y);
 }
 }

 let sumCosineMeasures = 0;
 for(let key in cosineMeasure){
     sumCosineMeasures += cosineMeasure[key]; // вычисляем сумму косинусных мер
 }

 for(let key in cosineMeasure){ // умножаем косинусные меры на оценки пользователей
     for(let i in updateGoodsEvaluations){
         for(let j in updateGoodsEvaluations[i].evaluations){
             if(updateGoodsEvaluations[i].name === key){
                 updateGoodsEvaluations[i].evaluations[j] = cosineMeasure[key] * updateGoodsEvaluations[i].evaluations[j];
             }
         }
     }
 }

 let arrayOfAllEvaluations = [];
 for(let key in updateGoodsEvaluations){ // получаем массив всех оценок пользователей кроме выбраного
     arrayOfAllEvaluations.push(Object.values(updateGoodsEvaluations[key].evaluations));
 }

 let sumAllEvaluations = arrayOfAllEvaluations.reduce((r, a) => { // считаем по столбцам матрицы
     a.forEach((b, i) => { r[i] = (r[i] || 0) + b; }); return r;
 }, []);


 let objSumOfEval = createObjectWithKeys(sumAllEvaluations, goodsEvaluations); // создаем объект суммы оценок с ключами оценок

 for(let key in selectUserEvaluations){ // удаляем из объекта те товары которые выбранный пользователь уже купил
     for(let i in selectUserEvaluations[key].evaluations){
         if(selectUserEvaluations[key].evaluations[i] !== null){
             delete objSumOfEval[i];
         }
     }
 }

 for(let key in objSumOfEval){ // делим сумму оценок на сумму косинусных мер
     objSumOfEval[key] = objSumOfEval[key] / sumCosineMeasures;
 }

 let sortedRecommendItem = sortObject(objSumOfEval); // сортируем по убыванию

 console.log(sortedRecommendItem);