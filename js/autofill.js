var map;

// Create a new blank array for all the listing markers.
var markers = [];

var showListing = false;
//whichMarkers => true: direction markers & false: infoWindow markers
var whichMarkers = undefined;

// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
var placeMarkers = [];
var globalCurrentCity = {'markers': [], 'latlng':[], name:'', 'attractions': []};
var globalIndex;
var globalWeather;

var checked = [];
var idShowListings = $('#show-listings');
var idHideListings = $('#hide-listings');
var idZoomToArea = $('#zoom-to-area');
var idGoPlaces = $('#go-places');
var idSubmit = $('#submit');
var idShowMore = $('#show-more');
var idStart = $('#start');
var idEnd = $('#end');
var idBeforeSelect = $('#before-select-city');
var idClearPlaces = $('#clear-places');

var ViewModel = function(){
    var that = this;
    this.cityList = ko.observableArray([]);
    CanadaData.forEach(city => {
        that.cityList.push(new Attractions(city, -1, -1));
    });
    this.currentCity = ko.observable();
    this.weather = ko.observable();

    this.alert = function(){
        if(globalCurrentCity.name === $( "#zoom-to-area-text option:selected" ).text()){
            window.alert('You are currently exploring '+ globalCurrentCity.name + ' already.');
        }
    }

    this.changeCurrentCity = function() {
        var citySelected = $("#zoom-to-area-text option:selected").text();
        var index = CanadaData.reduce((acc, val, index) => {
            if (val.name === citySelected) {
                acc = index;
            }
            return acc;
        }, -1);
        if (index !== -1) {
            //if the city has been changed or first time selecting
            if (globalIndex !== index) {
                if(globalCurrentCity.markers.length > 0){
                    viewMarkers.hideRender();
                    globalCurrentCity.markers = [];
                }
                that.currentCity(that.cityList()[index]);
                globalIndex = index;
                globalCurrentCity = {
                    'name': that.currentCity().name(),
                    'attractions': [],
                    'latlng': that.currentCity().latlng(),
                    'markers': that.currentCity().markers(),
                    'start': that.currentCity().start(),
                    'end': that.currentCity().end()
                };
                that.currentCity().attractions().forEach(pair => {
                    globalCurrentCity.attractions.push({
                        'attraction': pair.attraction(),
                        'clicked': pair.clicked(),
                    })
                });
                that.startPoint('Please select the start point.');
                that.endPoint('Please select the end point.');
                idStart.addClass('Please select the start point.');
                idEnd.addClass('Please select the start point.');


                if(globalCurrentCity.start > -1){
                    var target = $('li')[globalCurrentCity.start];
                    var startBtn = $(target).next();
                    startBtn.click();
                }
                if(globalCurrentCity.end > -1){
                    var target = $('li')[globalCurrentCity.end];
                    var startBtn = $(target).next();
                    $(startBtn.next()).click();
                }
                idBeforeSelect.hide();
                //if it is the first time searching
                if(globalCurrentCity.markers.length === 0){
                    octopus.loadMarkers(globalCurrentCity);
                } else {
                    viewMarkers.showRender();
                }
                octopus.weatherAPI()
            } else {
                var globalCityLength = globalCurrentCity.attractions.length;
                var currentCityLength = that.currentCity().attractions().length;
                if (globalCityLength > currentCityLength) {
                    that.currentCity(new Attractions(globalCurrentCity, that.currentCity().start(), that.currentCity().end()));
                } else {
                    globalCurrentCity = {
                        'name': that.currentCity().name(),
                        'attractions': [],
                        'latlng': that.currentCity().latlng(),
                        'markers': that.currentCity().markers(),
                        'start': that.currentCity().start(),
                        'end': that.currentCity().end()
                    };
                    that.currentCity().attractions().forEach(pair => {
                        globalCurrentCity.attractions.push({
                            'attraction': pair.attraction(),
                            'clicked': pair.clicked(),
                        })
                    });
                }
            }
            octopus.weatherAPI()
        } else {
            window.alert('Please select one of the following options.');
        }
    };

    this.isClicked = function(data, event){
        data.clicked(!data.clicked());
    };
    this.addStart = function(data, event){

        var index = $(event.target).attr('value');
        that.currentCity().start(Number(index));
        that.currentCity().attractions()[index].clicked(false);
        var attraction = that.currentCity().attractions()[index].attraction();
        that.startPoint(attraction);
        idStart.attr('class', attraction);

    };
    this.addEnd = function(data, event, index){
        var index = $(event.target).attr('value');
        that.currentCity().end(Number(index));

        var attraction = that.currentCity().attractions()[index].attraction();
        that.endPoint(attraction);
        idEnd.attr('class', attraction);
    };
    this.startPoint = ko.observable('Please select the start point.');
    this.endPoint = ko.observable('Please select the end point.');
    this.duration =ko.observable(0);

    this.refresh = function(){
        directionsDisplay.setDirections({routes: []});
        that.currentCity(new Attractions(CanadaData[globalIndex], -1, -1));
        that.cityList()[globalIndex] = that.currentCity();
        that.startPoint('Please select the start point.');
        that.endPoint('Please select the end point.');
    }

};


var CanadaData =[
    {
        'name': 'Vancouver',
        'attractions': [
            "Capilano Suspension Bridge",
            "Stanley Park",
            "Granville Island",
            "Chinatown, Vancouver",
            "Robson Street",
            "Gastown",
            "Vancouver Art Gallery",
            "Vancouver Maritime Museum",
            "Museum of Anthropology at UBC",
            "Vancouver Museum",
            "Science World at Telus World of Science"
        ],
        "markers":[],
        'latlng' : [
            {lat: 49.3428609, lng: -123.1149244},
            {lat: 49.30425839999999, lng: -123.14425219999998},
            {lat: 49.27115670000001, lng: -123.13399300000003},
            {lat: 49.2793761, lng: -123.10197700000003},
            {lat: 49.2846045, lng: -123.12482399999999},
            {lat: 49.2828082, lng: -123.10668750000002},
            {lat: 49.2829607, lng: -123.12047150000001},
            {lat: 49.277517, lng: -123.14718299999998},
            {lat: 49.269436, lng: -123.25885},
            {lat: 49.2762611, lng: -123.14452510000001},
            {lat: 49.273376, lng: -123.103834}
        ]
    },
    {
        'name': 'Toronto',
        'attractions': [
            "Rogers Centre",
            "Fort York",
            "Air Canada Centre",
            "Hockey Hall of Fame",
            "CN Tower",
            "Ontario Place",
            "Toronto Eaton Centre",
            "Royal Ontario Museum",
            "St. Lawrence Market",
            "Queen Street West",
            "Bata Shoe Museum",
            "Art Gallery of Ontario",
            "Kensington Market",
            "Casa Loma",
            "Ontario Science Centre",
            "Toronto Zoo",
            "Canada's Wonderland"
        ],
        "markers":[],
        'latlng': [
            {lat: 43.6414378, lng: -79.38935320000002},
            {lat: 43.6373362, lng: -79.40654769999998},
            {lat: 43.6434661, lng: -79.37909890000003},
            {lat: 43.6472722, lng: -79.37769019999996},
            {lat: 43.6425662, lng: -79.38705679999998},
            {lat: 43.62842879999999, lng: -79.41353300000003},
            {lat: 43.6544382, lng: -79.38069940000003},
            {lat: 43.6677097, lng: -79.3947771},
            {lat: 43.648578, lng: -79.37153810000001},
            {lat: 43.64550939999999, lng: -79.41233069999998},
            {lat: 43.6672426, lng: -79.40016600000001},
            {lat: 43.6536066, lng: -79.39251230000002},
            {lat: 43.6545236, lng: -79.40145660000002},
            {lat: 43.6780371, lng: -79.40944389999999},
            {lat: 43.7164069, lng: -79.3391838},
            {lat: 43.817699, lng: -79.1858904},
            {lat: 43.8430176, lng: -79.53946250000001}
        ]
    },
    {
        "name":"Winnipeg",
        "attractions":
            ["Assiniboine Park",
                "Fort Gibraltar",
                "La Maison Gabrielle Roy",
                "Le Musée de Saint-Boniface Museum",
                "Manitoba Children's Museum","Manitoba Museum",
                "Naval Museum of Manitoba",
                "The Fire Fighters Museum",
                "Transcona Historical Museum",
                "The Forks, Winnipeg, Manitoba|The Forks",
                "Upper Fort Garry",
                "Western Canada Aviation Museum",
                "Winnipeg Art Gallery","Winnipeg Railway Museum"
            ],
        "markers":[],
        "latlng":[
            {"lat":49.8702491,"lng":-97.23009389999999},
            {"lat":49.8989845,"lng":-97.12533429999996},
            {"lat":49.8902773,"lng":-97.11101959999996},
            {"lat":49.88779539999999,"lng":-97.12321859999997},
            {"lat":49.8875888,"lng":-97.12818820000001},
            {"lat":49.9000253,"lng":-97.13643890000003},
            {"lat":49.8861207,"lng":-97.13755909999998},
            {"lat":49.903648,"lng":-97.1317952},
            {"lat":49.89532819999999,"lng":-97.00530229999998},
            {"lat":49.8871675,"lng":-97.13135940000001},
            {"lat":49.887988,"lng":-97.13531899999998},
            {"lat":49.895744,"lng":-97.22117700000001},
            {"lat":49.8894208,"lng":-97.15063499999997},
            {"lat":49.888946,"lng":-97.13428669999996}
        ]
    },
    {
        "name":"Ottawa",
        "attractions":[
            "Parliament Hill",
            "National War Memorial (Canada)",
            "Rideau Canal",
            "National Gallery of Canada|National Art Gallery",
            "Chateau Laurier",
            "ByWard Market",
            "Canadian War Museum",
            "Canadian Aviation Museum",
            "Canadian Museum of Nature",
            "Canadian Museum of History",
            "Canadian Museum of Science and Technology",
            "Canada Agriculture Museum",
            "TD Place Stadium",
            "Canadian Tire Centre"
        ],
        "markers":[],
        "latlng":[
            {"lat":45.4235937,"lng":-75.70092899999997},
            {"lat":45.4241684,"lng":-75.69558080000002},
            {"lat":45.3964368,"lng":-75.69205850000003},
            {"lat":45.429535,"lng":-75.69890620000001},
            {"lat":45.4256015,"lng":-75.69536740000001},
            {"lat":45.4288655,"lng":-75.69115929999998},
            {"lat":45.4171032,"lng":-75.71694179999997},
            {"lat":45.458542,"lng":-75.64407699999998},
            {"lat":45.412709,"lng":-75.68851000000001},
            {"lat":45.4301581,"lng":-75.70920060000003},
            {"lat":45.4035099,"lng":-75.61890590000002},
            {"lat":45.3982089,"lng":-75.68346780000002},
            {"lat":45.3875416,"lng":-75.7093198},
            {"lat":45.2969151,"lng":-75.92682300000001}]
    },
    {
        "name":"Montreal",
        "attractions":[
            "Olympic Stadium (Montreal)|Olympic Stadium",
            "Montreal City Hall",
            "Montreal Museum of Fine Arts",
            "McCord Museum",
            "McGill University",
            "Mount Royal",
            "Parc Jean-Drapeau",
            "Underground city, Montreal",
            "Biosphère",
            "Redpath Museum",
            "Canadian Centre for Architecture",
            "La Ronde (amusement park)|La Ronde",
            "Saint Joseph's Oratory",
        ],
        "markers":[],
        "latlng":[
            {"lat":45.5579957,"lng":-73.5518816},
            {"lat":45.5089,"lng":-73.5543},
            {"lat":45.4985219,"lng":-73.57940009999999},
            {"lat":45.504356,"lng":-73.57358599999998},
            {"lat":45.50478469999999,"lng":-73.57715109999998},
            {"lat":45.5071024,"lng":-73.58740710000001},
            {"lat":45.5171,"lng":-73.5336},
            {"lat":45.5020,"lng":-73.5600},
            {"lat":45.5139,"lng":-73.5314},
            {"lat":45.50448309999999,"lng":-73.57751989999997},
            {"lat":45.491066,"lng":-73.578958},
            {"lat":45.5221,"lng":-73.5346},
            {"lat":45.4926,"lng":-73.6183}]
    },
    {
        "name":"Quebec City",
        "attractions":["Musée national des beaux-arts du Québec",
            "Musée de la civilisation",
            "Musée de l'Amérique française",
            "Espace Félix Leclerc",
            "Musée naval de Québec",
            "Choco-Musée Erico",
            "Ursulines of Quebec|Musée des Ursulines de Québec",
            "Plains of Abraham Exhibition Centre",
            "Plains of Abraham Exhibition Centre",
            "Parc Aquarium du Québec",
            "Jardin zoologique du Québec"],
        "markers":[],
        "latlng":[
            {"lat":46.80084129999999,"lng":-71.22486129999999},
            {"lat":46.8152288,"lng":-71.2023284},
            {"lat":46.8140955,"lng":-71.20659},
            {"lat":46.8755679,"lng":-71.09466609999998},
            {"lat":46.8185395,"lng":-71.20006219999999},
            {"lat":46.8103709,"lng":-71.21958280000001},
            {"lat":46.812205,"lng":-71.207741},
            {"lat":46.8015014,"lng":-71.21739680000002},
            {"lat":46.80685500000001,"lng":-71.21308399999998},
            {"lat":46.7516292,"lng":-71.28876200000002},
            {"lat":46.8918905,"lng":-71.30114989999998}
        ]
    },
];


//this Cat is making {clickCount: function, name: function, imgSrc:function, ...}
//an instance of a user-defined object type
var Attractions = function(data, start, end) {
    this.name = ko.observable(data.name);
    this.attractions = ko.observableArray([]);
    data.attractions.forEach(attraction=>{
        if(typeof attraction === 'object'){
            this.attractions.push({
                'attraction': ko.observable(attraction.attraction),
                'clicked': ko.observable(attraction.clicked)})
        } else {
            this.attractions.push({
                'attraction': ko.observable(attraction),
                'clicked': ko.observable(false),
            });
        }
    });
    this.markers = ko.observableArray(data.markers);
    this.latlng = ko.observableArray(data.latlng);
    this.start = ko.observable(start);
    this.end = ko.observable(end);
};

var Weather = function(data){
    icon = data['weather'][0]['icon'];
    this.iconurl= ko.observable('http://openweathermap.org/img/w/' + icon + '.png');
    this.weatherStatus= ko.observable(data['weather'][0]['main']);
    this.temp= ko.observable(data['main']['temp']);
    this.humidity= ko.observable(data['main']['humidity']);
    this.temp_min= ko.observable(data['main']['temp_min']);
    this.temp_max= ko.observable(data['main']['temp_max']);
    this.wind= ko.observable(data['wind']['speed']);
}

vm = new ViewModel();
ko.applyBindings(vm);





























var model = {
    style: function(){
        return [
            {
                featureType: 'water',
                stylers: [
                    { color: '#19a0d8' }
                ]
            },{
                featureType: 'administrative',
                elementType: 'labels.text.stroke',
                stylers: [
                    { color: '#ffffff' },
                    { weight: 6 }
                ]
            },{
                featureType: 'administrative',
                elementType: 'labels.text.fill',
                stylers: [
                    { color: '#e85113' }
                ]
            },{
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [
                    { color: '#efe9e4' },
                    { lightness: -40 }
                ]
            },{
                featureType: 'transit.station',
                stylers: [
                    { weight: 9 },
                    { hue: '#e85113' }
                ]
            },{
                featureType: 'road.highway',
                elementType: 'labels.icon',
                stylers: [
                    { visibility: 'off' }
                ]
            },{
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [
                    { lightness: 100 }
                ]
            },{
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [
                    { lightness: -100 }
                ]
            },{
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [
                    { visibility: 'on' },
                    { color: '#f0e4d3' }
                ]
            },{
                featureType: 'road.highway',
                elementType: 'geometry.fill',
                stylers: [
                    { color: '#efe9e4' },
                    { lightness: -25 }
                ]
            }
        ];
    }
};


var octopus = {
    init: function(){
        viewMap.init();
        viewMarkers.init();
        octopus.initEvents();
        octopus.initDirection();
    },
    initEvents: function(){
        directionsService = new google.maps.DirectionsService;
        directionsDisplay = new google.maps.DirectionsRenderer;
        idShowListings.on('click', viewMarkers.showRender);
        idHideListings.on('click', viewMarkers.hideRender);
        idGoPlaces.on('click', octopus.textSearchPlaces);
        idSubmit.on('click',function(){
            octopus.calculateAndDisplayRoute(directionsService, directionsDisplay);
        });
        idClearPlaces.on('click', function(){
            if(placeMarkers.length === 0){
                window.alert('All markers for place search is already cleared on the map.');
            }
            viewMarkers.clearRender(placeMarkers);
            placeMarkers = [];
        });

    },
    initDirection: function (){
        directionsDisplay.setMap(map);
    },
    calculateAndDisplayRoute: function(directionsService, directionsDisplay){
        viewMarkers.hideRender();
        whichMarkers = true;
        var waypts = [];
        var startVal = idStart.attr('class');
        console.log(startVal);
        var endVal = idEnd.attr('class');
        if(!startVal.includes('Please select') & !endVal.includes('Please select')){
            for (var i = 0; i < globalCurrentCity.attractions.length; i++){
                var attraction = globalCurrentCity.attractions[i].attraction;
                var click = globalCurrentCity.attractions[i].clicked;
                if(click ===  true & attraction !== startVal & attraction !== endVal){
                    waypts.push({
                        location: globalCurrentCity.latlng[i],
                        stopover: true
                    });
                } else if (attraction === startVal){
                    startVal = globalCurrentCity.latlng[i];
                } else if (attraction === endVal){
                    endVal = globalCurrentCity.latlng[i];
                }
            };
            directionsService.route({
                origin: startVal,
                destination: endVal,
                waypoints: waypts,
                optimizeWaypoints: true,
                travelMode: $('#travel-mode option:selected').text().toUpperCase()
            }, function(response, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                    var route = response.routes[0];
                    console.log(response);
                    viewList.routes(route);
                    idShowMore.show();
                    idShowMore.on('click', function(){
                        $('#directions-panel').show();
                    });
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        } else if (globalCurrentCity.name.length > 0) {
            if(showListing === true){
                window.alert('Please select start and end points.');
                viewMarkers.showRender();
            } else {
                window.alert('Please select start and end points.');
            }
        }

    },
    // This function firest when the user select "go" on the places search.
    // It will do a nearby search using the entered query string or place.
    textSearchPlaces: function () {
        var bounds = map.getBounds();
        viewMarkers.clearRender(placeMarkers);
        var search = document.getElementById('places-search').value;

        if(!search){
            window.alert('Please enter a place you want to search.');
        } else if(!($( "#zoom-to-area-text option:selected" ).text().length !== 0 || search.includes(' in ') || search.includes(' near '))){
            window.alert('Please enter a city you want to travel first, or please enter a place and a city together. For example, pizza delivery in Toronto.')
        } else {
            search +=' in ' + idZoomToArea.val();
            var placesService = new google.maps.places.PlacesService(map);
            placesService.textSearch({
                query: document.getElementById('places-search').value,
                bounds: bounds
            }, function(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    viewMarkers.createMarkersForPlaces(results);
                    idClearPlaces.show();
                    idGoPlaces.css("left", "250px");
                } else {
                    window.alert('Sorry, search request failed due to ' + status);
                }
            });
        }
    },

    makeMarkerIcon: function (markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21,34));
        return markerImage;
    },

    loadMarkers: function (info){
        // Style the markers a bit. This will be our listing marker icon.
        var defaultIcon = octopus.makeMarkerIcon('0091ff');

        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
        var highlightedIcon = octopus.makeMarkerIcon('FFFF24');
        // if(info.attraction)
        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < info.attractions.length; i++) {
            // Get the position from the location array.
            var position = info.latlng[i];
            var title = info.attractions[i].attraction;
            // Create a marker per location, and put into markers array.
            var marker = new google.maps.Marker({
                position: position,
                title: title,
                animation: google.maps.Animation.DROP,
                icon: defaultIcon,
                id: i
            });
            globalCurrentCity.markers.push(marker);

            var largeInfowindow = new google.maps.InfoWindow();
            // Create an onclick event to open the large infowindow at each marker.
            marker.addListener('click', function () {
                octopus.populateInfoWindow(this, largeInfowindow);
            });
            // Two event listeners - one for mouseover, one for mouseout,
            // to change the colors back and forth.
            marker.addListener('mouseover', function () {
                this.setIcon(highlightedIcon);
            });
            marker.addListener('mouseout', function () {
                this.setIcon(defaultIcon);
            });

        }
        viewMarkers.showRender();
    },
    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    populateInfoWindow: function (marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            // Clear the infowindow content to give the streetview time to load.
            infowindow.setContent('');
            infowindow.marker = marker;
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
            var streetViewService = new google.maps.StreetViewService();
            var radius = 50;
            // In case the status is OK, which means the pano was found, compute the
            // position of the streetview image, then calculate the heading, then get a
            // panorama from that and set the options
            function getStreetView(data, status) {
                if (status == google.maps.StreetViewStatus.OK) {
                    var nearStreetViewLocation = data.location.latLng;
                    var heading = google.maps.geometry.spherical.computeHeading(
                        nearStreetViewLocation, marker.position);
                    infowindow.setContent('<div>' + marker.title +'</div><div id="pano"></div>');
                    var panoramaOptions = {
                        position: nearStreetViewLocation,
                        pov: {
                            heading: heading,
                            pitch: 30
                        }
                    };
                    var panorama = new google.maps.StreetViewPanorama(
                        document.getElementById('pano'), panoramaOptions);
                } else {
                    infowindow.setContent('<div>' + marker.title + '</div>' +
                        '<div>No Street View Found</div>');
                }
            }
            // Use streetview service to get the closest streetview image within
            // 50 meters of the markers position
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
            // Open the infowindow on the correct marker.
            infowindow.open(map, marker);
        }

    },

    weatherAPI: function(){
        if (vm.currentCity().name() === 'Quebec City'){
            weatherurl='http://api.openweathermap.org/data/2.5/weather?q=quebec'+',ca&units=metric&APIKEY=' + 'Your_API_KEY'
        } else {
            weatherurl = 'http://api.openweathermap.org/data/2.5/weather?q=' + vm.currentCity().name() + ',ca&units=metric&APIKEY=' + 'Your_API_KEY'
        }
        $.ajax({
            type: 'GET',
            url: weatherurl,
            success: function(data){
                vm.weather(new Weather(data))
            }
        })
    },

};


var viewMap = {
    init: function(){
        viewMap.render();
    },
    render: function() {
        var styles = model.style();
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 61.356137, lng: -112.396204},
            zoom: 5,
            styles: styles,
            mapTypeControl: false
        });

        // Create a searchbox in order to execute a places search
        var searchBox = new google.maps.places.SearchBox(
            document.getElementById('places-search'));

        // Bias the searchbox to within the bounds of the map.
        searchBox.setBounds(map.getBounds());




        searchBox.addListener('places_changed', function() {
            searchBoxPlaces(this);
        });

        // This function fires when the user selects a searchbox picklist item.
        // It will do a nearby search using the selected query string or place.
        function searchBoxPlaces(searchBox) {
            viewMarkers.clearRender(placeMarkers);
            var places = searchBox.getPlaces();
            if (places.length == 0) {
                window.alert('We did not find any places matching that search!');
            } else {
                // For each place, get the icon, name and location.
                viewMarkers.createMarkersForPlaces(places);
            }
        }
    }
};



var viewMarkers = {
    init: function(){
    },
    showRender: function(){
        whichMarkers = false;
        if (directionsDisplay != null) {
            directionsDisplay.setDirections({routes: []});
        }
        var markers = globalCurrentCity.markers;
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
            bounds.extend(markers[i].position);
        }
        if(markers.length > 0){
            map.fitBounds(bounds);
            showListing = true;
        } else {
            window.alert('No listing was found!');
        }
    },
    hideRender: function(){
        markers = globalCurrentCity.markers;
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        showListing = false;
        viewMarkers.clearRender(placeMarkers);
    },
    clearRender: function (markers){
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    },
    // This function creates markers for each place found in either places search.
    createMarkersForPlaces: function (places) {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < places.length; i++) {
            var place = places[i];
            var icon = {
                url: place.icon,
                size: new google.maps.Size(35, 35),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(15, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            // Create a marker for each place.
            var marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location,
                id: place.place_id
            });
            // Create a single infowindow to be used with the place details information
            // so that only one is open at once.
            var placeInfoWindow = new google.maps.InfoWindow();
            // If a marker is clicked, do a place details search on it in the next function.
            marker.addListener('click', function() {
                if (placeInfoWindow.marker == this) {
                    window.alert("This infowindow already is on this marker!");
                } else {
                    viewMarkers.getPlacesDetails(this, placeInfoWindow);
                }
            });
            placeMarkers.push(marker);
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        }
        map.fitBounds(bounds);
    },
    // This is the PLACE DETAILS search - it's the most detailed so it's only
    // executed when a marker is selected, indicating the user wants more
    // details about that place.
    getPlacesDetails: function (marker, infowindow) {
        var service = new google.maps.places.PlacesService(map);
        service.getDetails({
            placeId: marker.id
        }, function(place, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                // Set the marker property on this infowindow so it isn't created again.
                infowindow.marker = marker;
                var innerHTML = '<div>';
                if (place.name) {
                    innerHTML += '<strong>' + place.name + '</strong>';
                }
                if (place.formatted_address) {
                    innerHTML += '<br>' + place.formatted_address;
                }
                if (place.formatted_phone_number) {
                    innerHTML += '<br>' + place.formatted_phone_number;
                }
                if (place.opening_hours) {
                    innerHTML += '<br><br><strong>Hours:</strong><br>' +
                        place.opening_hours.weekday_text[0] + '<br>' +
                        place.opening_hours.weekday_text[1] + '<br>' +
                        place.opening_hours.weekday_text[2] + '<br>' +
                        place.opening_hours.weekday_text[3] + '<br>' +
                        place.opening_hours.weekday_text[4] + '<br>' +
                        place.opening_hours.weekday_text[5] + '<br>' +
                        place.opening_hours.weekday_text[6];
                }
                if (place.photos) {
                    innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
                        {maxHeight: 100, maxWidth: 200}) + '">';
                }
                innerHTML += '<button id="'+marker.id+'" class="add" style="float: right" data-bind="$root.changeCurrentCity">Add this to my journey</button>';
                innerHTML += '</div>';
                infowindow.setContent(innerHTML);
                infowindow.open(map, marker);
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener('closeclick', function() {
                    infowindow.marker = null;
                });
                $('.add').on('click', function(){
                    if(globalCurrentCity.name.length === 0){
                        window.alert('Please select one of the following cities to add this place in your trip.');
                    } else {
                        var location = place.geometry.location;
                        var isDuplicate = globalCurrentCity.attractions.reduce((acc, val)=>{
                            if(val.attraction === place.name){
                                acc = true;
                            }
                            return acc;
                        }, false)
                        if(!isDuplicate){
                            globalCurrentCity.attractions.push({'attraction': place.name, 'clicked': true});
                            globalCurrentCity.latlng.push({'lat': location.lat(), 'lng': location.lng()});
                        }
                        if(!whichMarkers){
                            //when direction service is not working
                            octopus.loadMarkers({'attractions': [{'attraction': place.name, 'clicked': true}], 'latlng':[{'lat': location.lat(), 'lng': location.lng()}] });
                            viewMarkers.clearRender(placeMarkers);
                            placeMarkers = [];
                            idZoomToArea.click();
                        } else {
                            idSubmit.click();
                        }
                    }
                })
            }

        });
    }
};

var viewList = {
    routes: function(route){
        var summaryPanel = document.getElementById('directions-panel');
        summaryPanel.innerHTML = '<div id="closing-icon" style="font-size: 20px"><i class="fas fa-times"></i></div>';
        // For each route, display summary information.
        durationDay = 0;
        durationHr = 0;
        durationMin = 0;
        totalDuration = 0;
        for (var i = 0; i < route.legs.length; i++) {
            var routeSegment = i + 1;
            summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                '</b><br>';
            summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
            summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
            summaryPanel.innerHTML += 'Distance: ' + route.legs[i].distance.text + '<br>';
            summaryPanel.innerHTML += 'Duration: ' + route.legs[i].duration.text + '<br><br>';
        }

        $('#directions-panel .fa-times').on('click', function() {
            $('#directions-panel').hide();
        });
    }
};


