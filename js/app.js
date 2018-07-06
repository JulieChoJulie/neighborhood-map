// var ViewModel = function(){
//     var that = this;
//     this.catList = ko.observableArray([]);
//
//     initialCat.forEach(cat => {
//         //in catList => [Cat {clickCount: f, name: f, imgSrc: f...}, Cat {clickCount: f...}
//         that.catList.push(new Cat(cat));
//     });
//     //that.catList()[0] = Cat {clickCount: f, ..}
//     //this.currentCat = function(){Cat {clickCount: f, ...}
//     this.currentCat = ko.observable(that.catList()[0]);
//     this.incrementCounter = function(){
//         that.currentCat().clickCount(that.currentCat().clickCount() + 1);
//     };
//     this.changePhoto = function(cat){
//         //input cat = Cat {clickCount: f, name: f, imgSrc: f, ..}
//         that.currentCat(cat);
//     }
// };
// var initialCat = [
//     {
//         'clickCount': 0,
//         'name': 'Tabby',
//         'imgSrc': 'img/1.jpg',
//         'nickName': [
//             'tom',
//             'orange',
//             'nabi',
//             'goldya',
//         ]},
//     {
//         'clickCount': 0,
//         'name': 'Tiger',
//         'imgSrc': 'img/2.jpg',
//         'nickName': [
//             'tiny',
//             'tny'
//         ]},
//     {
//         'clickCount': 0,
//         'name': 'Lobby',
//         'imgSrc': 'img/3.jpg',
//         'nickName': [
//             'lovely',
//             'lob'
//         ]},
//     {
//         'clickCount': 0,
//         'name': 'Kitty',
//         'imgSrc': 'img/4.jpg',
//         'nickName': [
//             'Katty',
//             'kammy'
//         ]},
//     {
//         'clickCount': 0,
//         'name': 'Smokey',
//         'imgSrc': 'img/5.jpg',
//         'nickName': [
//             'Smukey',
//             'Smok',
//             'Snukey'
//         ]}
// ];
//
// //this Cat is making {clickCount: function, name: function, imgSrc:function, ...}
// //an instance of a user-defined object type
// var Cat = function(data) {
//     this.clickCount = ko.observable(data.clickCount);
//     this.name = ko.observable(data.name);
//     this.imgSrc = ko.observable(data.imgSrc);
//     this.nickName = ko.observableArray(data.nickName);
//     this.catLevel = ko.computed(function(){
//         if(this.clickCount() < 10){
//             return 'newborn';
//         } else if (this.clickCount() < 50) {
//             return 'infant';
//         } else if (this.clickCount() < 100 ) {
//             return 'child';
//         } else if (this.clickCount() < 200) {
//             return 'teen';
//         } else if (this.clickCount() < 500) {
//             return 'adult';
//         } else {
//             return 'ninja';
//         }
//     }, this);
// };
//
// ko.applyBindings(new ViewModel());