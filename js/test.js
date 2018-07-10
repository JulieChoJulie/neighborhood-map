
    var map;

// Create a new blank array for all the listing markers.
    var markers = [];

// This global polygon variable is to ensure only ONE polygon is rendered.
    var polygon = null;
    var globalCity = undefined;
    var attractionList = [];
    var latlngList = [];
    var showListing = false;

// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
    var placeMarkers = [];
    var numOfAttractions = 0;
    var idWaypoints = $('#waypoints');
    var idShowListings = $('#show-listings');
    var idHideListings = $('#hide-listings');
    var idZoomToArea = $('#zoom-to-area');
    var idGoPlaces = $('#go-places');


    var model = {
        init: function(){
            localStorage.notes = JSON.stringify([]);
        },
        // data: {
        //     'Vancouver': [
        //         'Capilano Suspension Bridge',
        //         'Stanley Park',
        //         'Granville Island',
        //         'Chinatown, Vancouver',
        //         'Robson Street',
        //         'Gastown',
        //         'Vancouver Art Gallery',
        //         'Vancouver Maritime Museum',
        //         'Museum of Anthropology at UBC',
        //         'Vancouver Museum',
        //         'Science World at Telus World of Science'
        //     ],
        //     'Winnipeg': [
        //         'Assiniboine Park',
        //         'Costume Museum of Canada',
        //         'Fort Gibraltar',
        //         'La Maison Gabrielle Roy',
        //         'Le Musée de Saint-Boniface Museum',
        //         'Dalnavert Museum',
        //         'Louis Riel statue',
        //         'Manitoba Children\'s Museum',
        //         'Manitoba Museum',
        //         'Naval Museum of Manitoba',
        //         'Royal Canadian Mint',
        //         'The Exchange District',
        //         'The Fire Fighters Museum',
        //         'Transcona Historical Museum',
        //         'The Forks',
        //         'Upper Fort Garry',
        //         'Western Canada Aviation Museum',
        //         'Winnipeg Art Gallery',
        //         'Winnipeg Railway Museum'
        //     ]
        // },
        currentCity: {
            'name': undefined,
            'attractions': undefined,
            'markers': [],
            'latlng' : [],
        },
        addCity: function (storage){
            var data = JSON.parse(localStorage.notes);
            data.push(storage);
            // Example: model.storage = {name: city,
            //     attractions: attractionList,
            //     markers: []
            //     latlng: [];
            // }
            localStorage.notes = JSON.stringify(data);
        },
        cityList: function(){
            return JSON.parse(localStorage.notes);
        },
        clicked: function(name, phase){
            data = JSON.parse(localStorage.notes);
            var index = data.findIndex(obj => obj.name === name);
            model.currentCat = data[index];
        },
        storage: function(input){return input},
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
            model.init();
            viewMap.init();
            viewMarkers.init();
            octopus.initEvents();
        },
        initEvents: function(){
            idShowListings.on('click', viewMarkers.showRender);
            idHideListings.on('click', viewMarkers.hideRender);
            idZoomToArea.on('click', octopus.zoomCity);
            idGoPlaces.on('click', octopus.textSearchPlaces);
        },
        updateCurrentCity: function(storage){
            model.currentCity = storage;
        },
        cityList: function(){
            return model.cityList;
        },
        getCurrentCity: function(){
            return model.currentCity;
        },
        clicked: function (name){
            return model.clicked(name);
        },
        zoomCity: function(){
            // Initialize the geocoder.
            var geocoder = new google.maps.Geocoder();
            // Get the address or place that the user entered.
            var city = document.getElementById('zoom-to-area-text').value;
            city = octopus.modifyCityName(city);
            if(model.currentCity.name === city & showListing){
                window.alert('We are showing the attraction lists for ' + city + '. Please try another city.');
            } else if (model.currentCity.name === city & !showListing){
                viewMarkers.showRender();
            } else if (city == '') {
                // Make sure the address isn't blank
                window.alert('You must enter a city in Canada.');
            } else {
                // Initialize the locations array.
                // Geocode the address/area entered to get the center. Then, center the map
                // on it and zoom in
                geocoder.geocode(
                    { address: city,
                        componentRestrictions: {locality: city}
                    }, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            map.setCenter(results[0].geometry.location);
                            map.setZoom(15);
                            locations = [];
                            octopus.getInfoForCountry('Canada', city);
                        } else {
                            window.alert('We could not find that location - try entering a more' +
                                ' specific place.');
                        }
                    });
            }
        },


        // This function firest when the user select "go" on the places search.
        // It will do a nearby search using the entered query string or place.
        textSearchPlaces: function () {
            var bounds = map.getBounds();
            hideMarkers(placeMarkers);
            var placesService = new google.maps.places.PlacesService(map);
            placesService.textSearch({
                query: document.getElementById('places-search').value,
                bounds: bounds
            }, function(results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    createMarkersForPlaces(results);
                }
            });
        },

        modifyCityName: function (cityStr) {
        // Slice city name from the full address and make it case insensitive
        // ex. Toronto, ON, Canada => toronto.
        cityStr = cityStr.split('');
        var index = cityStr.indexOf(',');
        var indexOfSpace = cityStr.indexOf(' ');
        cityStr = cityStr.join('');
        cityStr = cityStr.slice(0,1).toUpperCase()+cityStr.substring(1);
        if (index !== -1){
            cityStr = cityStr.substring(0, index);
        }
        if(indexOfSpace !== -1 && (indexOfSpace < index || index === -1)) {
            cityStr = cityStr.slice(0, indexOfSpace+1) + cityStr[indexOfSpace+1].toUpperCase()
                + cityStr.substring(indexOfSpace+2);
        }
        return cityStr;
        },

        listOfSliceWords: function (words, start, end){
            var res = [];
            for(var i = 0; i < words.length; i) {

                var includeStart = words.indexOf(start);
                var startIndex = includeStart + start.length;
                var endIndex = words.indexOf(end, startIndex) -1;
                if(includeStart === -1 || endIndex === -2) {
                    return res;
                }
                var slicedword = words.slice(startIndex, endIndex+1);
                res.push(slicedword);
                words = words.substring(endIndex+1+end.length);

            }
            return res;
        },

        getInfoForCountry: function (country, city) {
            var cityList = model.cityList();
            var isInList = false;
            cityList.forEach(obj => {
                if (obj.name === city) {
                    console.log('here');
                    viewMarkers.clearRender(model.currentCity.markers);
                    octopus.updateCurrentCity(obj);
                    octopus.loadMarkers();
                    viewList();
                    isInList = true;

                }
            });
            if (!isInList) {
                var wikiurl = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&rvprop=content&&titles=Tourism_in_' + country;
                var wikiRequestTimeOut = setTimeout(function () {
                    $('<option value="fail">Failed to load Wikipedia resources.</option>').appendTo($('#waypoints'));
                }, 8000);
                $.ajax({
                    url: wikiurl,
                    dataType: "jsonp",
                    jsonp: "callback",
                    success: function (response) {
                        var wikiList = response[1];
                        var attractions = response['query']['pages']['288026']['revisions']['0']['*'];

                        var arrayOfCities = octopus.listOfSliceWords(attractions, '\'\'\'Sites of interest in ', '\n\n')
                        var attractionsInfo = arrayOfCities.map(city => {
                            var res = {name: '', attractions: []};
                            var endIndexOfCityName = city.indexOf('\'') - 1;
                            cityName = city.slice(0, endIndexOfCityName + 1);
                            res.name = cityName;
                            var arrayOfAttractionsForCity = octopus.listOfSliceWords(city, '\n* [[', ']]').map(attraction => {
                                if (!attraction.includes('See also: ') && !attraction.includes('List of attractions'))
                                    res.attractions.push(attraction);
                            });
                            return res;
                        });
                        clearTimeout(wikiRequestTimeOut);
                        octopus.getAttractionsForCity(attractionsInfo, city);
                    }
                });
            }
        },

        getAttractionsForCity: function (attractionsInfo, cityStr) {
            var count = 0;
            for (var i = 0; i < attractionsInfo.length; i++){
                var cityInfo = attractionsInfo[i];
                if (cityInfo.name === cityStr){
                    numOfAttractions = cityInfo.attractions.length;
                    console.log(numOfAttractions);
                    attractionList =[];
                    latlngList = [];
                    cityInfo.attractions.map(attraction => {
                        count += 500;
                        setTimeout(function(){octopus.storeLocations(attraction, cityStr);}, count);
                    });
                    break;
                }
            }
        },

        storeLocations: function (attraction, city){
            var request = {
                query: attraction,
                fields: ['geometry']};
            service = new google.maps.places.PlacesService(map);
            service.findPlaceFromQuery(request, callback);
            function callback(results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        var place = results[i]['geometry']['location'];
                        var latlng = {lat: place.lat(), lng: place.lng()};
                        var info = {title: attraction, location: latlng};
                        attractionList.push(attraction);
                        latlngList.push(latlng);
                        console.log(attractionList.length);
                        console.log('numofattr:' + numOfAttractions);
                        if(attractionList.length === numOfAttractions & attractionList.length !== 0){
                            model.storage = {name: city,
                                attractions: attractionList,
                                markers: [],
                                latlng: latlngList,
                            };
                            viewMarkers.clearRender(model.currentCity.markers);
                            octopus.updateCurrentCity(model.storage);
                            model.addCity(model.storage);
                            octopus.loadMarkers();
                            viewList();
                        }
                    }
                } else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
                    numOfAttractions -= 1;
                } else {
                    setTimeout(octopus.storeLocations(attraction, city), 500);
                }
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

        loadMarkers: function (){
            viewMarkers.hideRender();
            // Style the markers a bit. This will be our listing marker icon.
            var defaultIcon = octopus.makeMarkerIcon('0091ff');

            // Create a "highlighted location" marker color for when the user
            // mouses over the marker.
            var highlightedIcon = octopus.makeMarkerIcon('FFFF24');
            console.log(locations);
            var currentCity = model.currentCity;
            // The following group uses the location array to create an array of markers on initialize.
            for (var i = 0; i < currentCity.attractions.length; i++) {
                // Get the position from the location array.
                var position = currentCity.latlng[i];
                var title = currentCity.attractions[i];
                // Create a marker per location, and put into markers array.
                var marker = new google.maps.Marker({
                    position: position,
                    title: title,
                    animation: google.maps.Animation.DROP,
                    icon: defaultIcon,
                    id: i
                    });
                model.currentCity.markers.push(marker);
                var largeInfowindow = new google.maps.InfoWindow();
                // Create an onclick event to open the large infowindow at each marker.
                marker.addListener('click', function () {
                    populateInfoWindow(this, largeInfowindow);
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

        changeCity: function(name){

        },

    };



    var viewMap = {
        init: function(){
            idWaypoints.empty();
            viewMap.render();
        },
        render: function() {
            var styles = model.style();
            // Constructor creates a new map - only center and zoom are required.
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: 61.356137, lng: -112.396204},

                zoom: 4,
                styles: styles,
                mapTypeControl: false
            });


            // This autocomplete is for use in the geocoder entry box.
            var zoomAutocomplete = new google.maps.places.Autocomplete(
                document.getElementById('zoom-to-area-text'));
            // Bias the boundaries within Canada for the zoom to area text.
            zoomAutocomplete.setComponentRestrictions(
                {'country': ['ca']}
            );

            // Create a searchbox in order to execute a places search
            var searchBox = new google.maps.places.SearchBox(
                document.getElementById('places-search'));
            // Bias the searchbox to within the bounds of the map.
            searchBox.setBounds(map.getBounds());

            // These are the real estate listings that will be shown to the user.
            // Normally we'd have these in a database instead.


            // Listen for the event fired when the user selects a prediction from the
            // picklist and retrieve more details for that place.
            searchBox.addListener('places_changed', function() {
                searchBoxPlaces(this);
            });





















            // octopus.catList().forEach(cat => {
            //     $('<button value="' + cat.name + '">' + cat.name + '</button>').appendTo(list);
            //     // var button = document.createElement("button");
            //     // t = document.createTextNode(cat.name);
            //     // button.appendChild(t);
            //     // button.value = cat.name;
            //     // document.getElementsByClassName('list')[0].appendChild(button);
            //
            //
            //     $('<div class="photo-click" id="' + cat.name + '" style="display:none"></div>').appendTo(photo);
            //     $('<img class="image" src="' + cat.name + '.jpg">').appendTo($('#' + cat.name + ''));
            //     $('<span class="num_of_click">0</span> clicked').appendTo($('#' + cat.name + ''));
            //     $('#'+cat.name).hide();
            // });
        }
    };



    var viewMarkers = {
        init: function(){
        },
        showRender: function(){
            var currentCity = octopus.getCurrentCity();
            var markers = currentCity.markers;
            var bounds = new google.maps.LatLngBounds();
            // Extend the boundaries of the map for each marker and display the marker
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
                bounds.extend(markers[i].position);
            }
            map.fitBounds(bounds);
            showListing = true;
        },
        hideRender: function(){
            var currentCity = octopus.getCurrentCity();
            markers = currentCity.markers;
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            showListing = false;
        },
        clearRender: function (markers){
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
        }
    };

    var viewList = function () {
        $('#waypoints').empty();
        var currentCity = octopus.getCurrentCity();
        currentCity.attractions.map(attraction => {
            $('#waypoints').append('<option id="'+attraction+'">'+attraction+ '</option>');
        });
    };

    // var viewAdmin = {
    //     init:function(){
    //         $('#admin-form').hide()
    //         $('<button class="admin">Admin</button>').appendTo(list);
    //         $('.admin').on('click', function(){
    //             octopus.admin();
    //         })
    //     },
    //     render: function(currentCat){
    //         $('#admin-form').show();
    //         $('#form-cat-name').val(currentCat.name);
    //         $('#form-cat-click').val(currentCat.click);
    //         $('#form-cat-url').val('value', currentCat.name + '.jpg');
    //         $('.form').submit(function(e){
    //             octopus.changeName(currentCat.name, $('#form-cat-name').val());
    //             octopus.changeClick(currentCat.click, $('#from-cat-click').val());
    //             e.preventDefault();
    //         })
    //     }
    // }



