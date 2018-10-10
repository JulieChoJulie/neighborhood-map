const apiurl = 'http://api.openweathermap.org/data/2.5/weather?q=montreal,ca&units=metric&APIKEY=63fbaadcbd5b000672c2d8eee89622ce'
//
//
// $.ajax({
//     url: url,
//     dataType: jsonp,
//     success: function(data){
//         return data
//     }
// });
//
//
// var Weather = function(data){
//     if (data['weather']){
//         icon = data['weather'][0]['icon'];
//         this.iconurl= ko.observable('http://openweathermap.org/img/w/' + icon + '.png');
//         this.weatherStatus= ko.observable(data['weather'][0]['main']);
//         this.temp= ko.observable(data['main']['temp']);
//         this.humidity= ko.observable(data['main']['humidity']);
//         this.temp_min= ko.observable(data['main']['temp_min']);
//         this.temp_max= ko.observable(data['main']['temp_ax']);
//         this.wind= ko.observable(data['wind']['speed']);
//     } else {
//         this.iconurl = ko.observable('');
//         this.weatherStatus = ko.observable('');
//         this.temp = ko.observable('')
//         this.temp_max = ko.observable('')
//         this.temp_min = ko.observable('')
//         this.wind = ko.observable('')
//     }
// }

$(function(){
    $.ajax({
        type: 'GET',
        url: apiurl,
        success: function(data){
            console.log(data)
        }
    })
})