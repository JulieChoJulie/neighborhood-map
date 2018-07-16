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
var checked = [];
var idShowListings = $('#show-listings');
var idHideListings = $('#hide-listings');
var idZoomToArea = $('#zoom-to-area');
var idGoPlaces = $('#go-places');
var idSubmit = $('#submit');
var idShowMore = $('#show-more');
var idStart = $('#start');
var idEnd = $('#end');
var idClearPlaces = $('#clear-places');

var ViewModel = function(){
    var that = this;
    this.cityList = ko.observableArray([]);
    CanadaData.forEach(city => {
        that.cityList.push(new Attractions(city));
    });
    this.currentCity = ko.observable();


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
                that.currentCity(that.cityList()[index]);
                globalIndex = index;
                globalCurrentCity = {
                    'name': that.currentCity().name(),
                    'attractions': [],
                    'latlng': that.currentCity().latlng(),
                    'markers': that.currentCity().markers(),
                };
                that.currentCity().attractions().forEach(pair => {
                    globalCurrentCity.attractions.push({
                        'attraction': pair.attraction(),
                        'clicked': pair.clicked()
                    })
                });
                viewList.hoverLi();
                octopus.loadMarkers(globalCurrentCity);
            } else {
                var globalCityLength = globalCurrentCity.attractions.length;
                var currentCityLength = that.currentCity().attractions().length;
                if (globalCityLength > currentCityLength) {
                    that.currentCity(new Attractions(globalCurrentCity));
                } else {
                    globalCurrentCity = {
                        'name': that.currentCity().name(),
                        'attractions': [],
                        'latlng': that.currentCity().latlng(),
                        'markers': that.currentCity().markers(),
                    };
                    that.currentCity().attractions().forEach(pair => {
                        globalCurrentCity.attractions.push({
                            'attraction': pair.attraction(),
                            'clicked': pair.clicked()
                        })
                    });
                }
                viewList.hoverLi();
            }
        } else {
            window.alert('Please select one of the following options.');
        }
    };

    this.isClicked = function(data, event){
        data.clicked(!data.clicked());
    };

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
            "Old Montreal",
            "Festival International de Jazz de Montréal",
            "Opéra de Montréal",
            "Montreal Museum of Fine Arts",
            "McCord Museum","Crescent Street",
            "Canadian Grand Prix","McGill University",
            "Mount Royal",
            "Parc Jean-Drapeau",
            "Underground city, Montreal",
            "Biosphère","Redpath Museum",
            "Canadian Centre for Architecture",
            "La Ronde (amusement park)|La Ronde",
            "Saint Joseph's Oratory",
            "Underground city, Montreal|Underground City"
        ],
        "markers":[],
        "latlng":[
            {"lat":45.5579957,"lng":-73.5518816},
            {"lat":45.555918,"lng":-73.5510051},
            {"lat":45.5074534,"lng":-73.55441769999999},
            {"lat":45.4985219,"lng":-73.57940009999999},
            {"lat":45.504356,"lng":-73.57358599999998},
            {"lat":45.4974965,"lng":-73.57631959999998},
            {"lat":45.50478469999999,"lng":-73.57715109999998},
            {"lat":45.5071024,"lng":-73.58740710000001},
            {"lat":45.517066,"lng":-73.53358000000003},
            {"lat":45.50374799999999,"lng":-73.52912500000002},
            {"lat":45.5021806,"lng":-73.56079879999999},
            {"lat":45.50448309999999,"lng":-73.57751989999997},
            {"lat":45.491066,"lng":-73.578958},
            {"lat":45.5226704,"lng":-73.5344713}]
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
var Attractions = function(data) {
    this.name = ko.observable(data.name);
    this.attractions = ko.observableArray([]);
    data.attractions.forEach(attraction=>{
        if(typeof attraction === 'object'){
            this.attractions.push({'attraction': ko.observable(attraction.attraction), 'clicked': ko.observable(attraction.clicked)})
        } else {
            this.attractions.push({'attraction': ko.observable(attraction), 'clicked':ko.observable(false)});
        }
    });
    this.markers = ko.observableArray(data.markers);
    this.latlng = ko.observableArray(data.latlng);
};

ko.applyBindings(new ViewModel());





























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
        viewList.init();
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
            viewMarkers.clearRender(placeMarkers);
        });

    },
    initDirection: function (){
        directionsDisplay.setMap(map);
    },
    calculateAndDisplayRoute: function(directionsService, directionsDisplay){
        viewMarkers.hideRender();
        whichMarkers = true;
        var waypts = [];
        if(idStart.attr('class')&&idEnd.attr('class')){
            for (var i = 0; i < globalCurrentCity.attractions.length; i++){
                var attraction = globalCurrentCity.attractions[i].attraction;
                var click = globalCurrentCity.attractions[i].clicked;
                if(click ===  true & attraction !== idStart.attr('class') & attraction !== idEnd.attr('class')){
                    waypts.push({
                        location: globalCurrentCity.latlng[i],
                        stopover: true
                    });
                }
            };
            directionsService.route({
                origin: idStart.attr('class'),
                destination: idEnd.attr('class'),
                waypoints: waypts,
                optimizeWaypoints: true,
                travelMode: 'DRIVING'
            }, function(response, status) {
                if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                    var route = response.routes[0];
                    viewList.routes(route);
                    idShowMore.show();
                    idShowMore.on('click', function(){
                        $('#directions-panel').show();
                    });
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            });
        } else{
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
                        '<div>No Street View Found</div>'+
                        ' <input class="addStart" id="'+marker.title+'" type="button" value="Add Start">' +
                        '<input class="addEnd" id="'+marker.title+'" type="button" value="Add End">');
                }
                $('.addStart').on('click', function(){
                    idStart.removeAttr('class');
                    var title = $(this).attr('id');
                    idStart.val(title);
                    var index = model.currentCity.attractions.indexOf(title);
                    var latlng = model.currentCity.latlng[index];
                    idStart.addClass(JSON.stringify(latlng));
                });
                $('.addEnd').on('click', function(){
                    idEnd.removeAttr('class');
                    var title = $(this).attr('id');
                    idEnd.val(title);
                    var index = model.currentCity.attractions.indexOf(title);
                    var latlng = model.currentCity.latlng[index];
                    idEnd.addClass(JSON.stringify(latlng));
                });
            }
            // Use streetview service to get the closest streetview image within
            // 50 meters of the markers position
            streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
            // Open the infowindow on the correct marker.
            infowindow.open(map, marker);
        }

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
                innerHTML += '<button id="'+marker.id+'" class="add" style="float: right">Add this to my journey</button>';
                innerHTML += '</div>';
                infowindow.setContent(innerHTML);
                infowindow.open(map, marker);
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener('closeclick', function() {
                    infowindow.marker = null;
                });
                $('.add').on('click', function(){
                    var location = place.geometry.location;
                    globalCurrentCity.attractions.push({'attraction': place.name, 'clicked': true});
                    globalCurrentCity.latlng.push({'lat': location.lat(), 'lng': location.lng()});
                    if(!whichMarkers){
                        //when direction service is not working
                        octopus.loadMarkers({'attractions': [{'attraction': place.name, 'clicked': true}], 'latlng':[{'lat': location.lat(), 'lng': location.lng()}] });
                    } else {
                        idSubmit.click();
                    }
                })
            }

        });
    }
};

var viewList = {
    init: function (){
        octopus.initDirection();
        viewList.hoverLi();
    },
    hoverLi: function(){
        // Create a "close" button and append it to each list item
        var List = $('li');
        var i;
        for (i = 0; i < List.length; i++) {
            var spanStart = document.createElement("SPAN");
            var txtStart = document.createTextNode("Start");
            spanStart.className = "addStart";
            spanStart.appendChild(txtStart);
            List[i].appendChild(spanStart);
            var spanEnd = document.createElement("SPAN");
            var txtEnd = document.createTextNode("End");
            spanEnd.className = "addEnd";
            spanEnd.appendChild(txtEnd);
            List[i].appendChild(spanEnd);

        }
        var addStart = document.getElementsByClassName("addStart");
        var addEnd = document.getElementsByClassName("addEnd");
        var i;
        for (i = 0; i < addStart.length; i++) {
            addStart[i].onclick = function() {
                var div = $(this).parent()[0];
                var text = $(div).text();
                var index = text.indexOf('Start');
                idStart.val(text.substring(0, index));
                idStart.attr('class', text.substring(0, index));
            };
            addEnd[i].onclick = function(){
                var div = $(this).parent()[0];
                var text = $(div).text();
                var index = text.indexOf('Start');
                idEnd.val(text.substring(0, index));
                idEnd.attr('class', text.substring(0, index));
            };
        }
    },
    routes: function(route){
        var summaryPanel = document.getElementById('directions-panel');
        summaryPanel.innerHTML = '<div id="closing-icon" style="font-size: 40px"><i class="fas fa-times"></i></div>';
        // For each route, display summary information.
        for (var i = 0; i < route.legs.length; i++) {
            var routeSegment = i + 1;
            summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
                '</b><br>';
            summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
            summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
            summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
        }
        $('#directions-panel .fa-times').on('click', function() {
            $('#directions-panel').hide();
        });
    }
};

















