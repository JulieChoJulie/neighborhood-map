
    var map;

// Create a new blank array for all the listing markers.
    var markers = [];

// This global polygon variable is to ensure only ONE polygon is rendered.
    var polygon = null;
    var globalCity = undefined;
    var attractionList = [];
    var latlngList = [];
    var showListing = false;
    //whichMarkers => true: direction markers & false: infoWindow markers
    var whichMarkers = undefined;
    var secondClicked = false;

// Create placemarkers array to use in multiple functions to have control
// over the number of places that show.
    var placeMarkers = [];
    var numOfAttractions = 0;
    var idWaypoints = $('#waypoints');
    var idShowListings = $('#show-listings');
    var idHideListings = $('#hide-listings');
    var idZoomToArea = $('#zoom-to-area');
    var idGoPlaces = $('#go-places');
    var idSubmit = $('#submit');
    var idShowMore = $('#show-more');
    var idStart = $('#start');
    var idEnd = $('#end');
    var idClearPlaces = $('#clear-places');


    var model = {
        init: function(){
            localStorage.notes = JSON.stringify([]);
            localStorage.add = JSON.stringify([]);
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
            'attractions': [],
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
        clickStorage:[],
        storage: function(input){return input},
        addStorage: {'latlng': [],
        'attractions': [],
        'markers': []},
        updateAddStroage: function(latlng, attraction){
            model.addStorage['latlng'].push(latlng);
            model.addStorage['attractions'].push(attraction);
        },
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
            directionsService = new google.maps.DirectionsService;
            directionsDisplay = new google.maps.DirectionsRenderer;
            idSubmit.on('click',function(){
                octopus.calculateAndDisplayRoute(directionsService, directionsDisplay);
            });
            idClearPlaces.on('click', function(){
                viewMarkers.clearRender(placeMarkers);
            })

        },
        clicked: function(input){
            model.clicked.push(input);
        },
        getClicked: function(){
            return model.clicked;
        },
        clearClicked: function(){
            model.clicked = [];
        },
        clearAddStorage: function() {
            model.addStorage = {
                'latlng': [],
                'attractions': [],
                'markers': []
            };
        },
        initDirection: function (){
            directionsDisplay.setMap(map);
        },
        calculateAndDisplayRoute: function(directionsService, directionsDisplay){
            if(!whichMarkers){
                octopus.clearClicked();
            }
            whichMarkers = true;
            viewMarkers.clearRender(model.currentCity.markers);
            viewMarkers.clearRender(model.addStorage.markers);
            var waypts = [];
            var checkboxArray = document.getElementById('waypoints');
            for (var i = 0; i < model.clicked; i++){
                waypts.push({
                    locations: model.clicked.locations[i],
                    stopover:true
                });

            }
            for (var i = 0; i < checkboxArray.length; i++) {
                if (checkboxArray.options[i].selected) {
                    var index = model.currentCity.attractions.indexOf(checkboxArray[i].value);
                    if(index === -1){
                        index = model.addStorage.attractions.indexOf(checkboxArray[i].value);
                        waypts.push({
                            location: model.addStorage.latlng[index],
                            stopover: true
                        }
                        );
                        octopus.clicked({name: model.addStorage.attractions[index], locations:model.addStorage.latlng[index]});
                    } else {
                        waypts.push({
                            location: model.currentCity.latlng[index],
                            stopover: true
                        });
                        octopus.clicked({where: 'currentCity', name: model.currentCity.attractions[index], index: index, locations:model.currentCity.latlng[index]});
                    }

                }
            }
            if(idStart.attr('class')&&idEnd.attr('class')){
                directionsService.route({
                    origin: JSON.parse(idStart.attr('class')),
                    destination: JSON.parse(idEnd.attr('class')),
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
                        viewMarkers.clearRender(model.currentCity.markers);
                        viewMarkers.clearRender(model.addStorage.markers);
                    } else {
                        window.alert('Directions request failed due to ' + status);
                    }
                });
            } else{
                if(showListing === true){
                    window.alert('Please select start and end points');
                }
                viewMarkers.showRender();
            }

        },
        updateCurrentCity: function(storage){
            model.currentCity = storage;
        },
        getAddStorage: function(){
            return model.addStorage;
        },
        cityList: function(){
            return model.cityList;
        },
        getCurrentCity: function(){
            return model.currentCity;
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
                view.clear();

                // Initialize the locations array.
                // Geocode the address/area entered to get the center. Then, center the map
                // on it and zoom in
                geocoder.geocode(
                    { address: city,
                        componentRestrictions: {locality: city}
                    }, function(results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            idStart.removeAttr('class');
                            idEnd.removeAttr('class');
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
            viewMarkers.clearRender(placeMarkers);
            var search = document.getElementById('places-search').value;
            if(!search){
                window.alert('Please enter a place you want to search.');
            } else if(!idZoomToArea.val() & !(search.includes(' in ') || search.includes(' near '))){
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

        modifyCityName: function (cityStr) {
        // Slice city name from the full address and make it case insensitive
        // ex. Toronto, ON, Canada => toronto.
        cityStr = cityStr.split('');
        var index = cityStr.indexOf(',');
        var indexOfSpace = cityStr.indexOf(' ');
        cityStr = cityStr.join('');
        cityStr = cityStr.slice(0,1).toUpperCase()+cityStr.substring(1).toLowerCase();
        if (index !== -1){
            cityStr = cityStr.substring(0, index);
        }
        if(indexOfSpace !== -1 && (indexOfSpace < index || index === -1)) {
            cityStr = cityStr.slice(0, indexOfSpace+1) + cityStr[indexOfSpace+1].toUpperCase()
                + cityStr.substring(indexOfSpace+2).toLowerCase();
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
                    viewMarkers.clearRender(model.currentCity.markers);
                    octopus.updateCurrentCity(obj);
                    octopus.loadMarkers(obj, 'currentCity');
                    octopus.loadMakrers(model.addStorage, '');
                    viewList.render();
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
                            octopus.loadMarkers(model.storage, 'currentCity');
                            octopus.loadMarkers(model.addStorage, '');
                            viewList.render();
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

        loadMarkers: function (info, whichStorage){
            viewMarkers.hideRender();
            // Style the markers a bit. This will be our listing marker icon.
            var defaultIcon = octopus.makeMarkerIcon('0091ff');

            // Create a "highlighted location" marker color for when the user
            // mouses over the marker.
            var highlightedIcon = octopus.makeMarkerIcon('FFFF24');
            // var currentCity = model.currentCity;
            // The following group uses the location array to create an array of markers on initialize.
            for (var i = 0; i < info.attractions.length; i++) {
                // Get the position from the location array.
                var position = info.latlng[i];
                var title = info.attractions[i];
                // Create a marker per location, and put into markers array.
                var marker = new google.maps.Marker({
                    position: position,
                    title: title,
                    animation: google.maps.Animation.DROP,
                    icon: defaultIcon,
                    id: i
                    });
                if(whichStorage === 'currentCity'){
                    model.currentCity.markers.push(marker);
                } else {
                    model.addStorage.markers.push(marker);
                }

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
                        infowindow.setContent('<div>' + marker.title + ' <input class="addStart" id="'+marker.title+'" type="button" value="Add Start">' +
                            '<input class="addEnd" id="'+marker.title+'" type="button" value="Add End">' +
                            '</div><div id="pano"></div>');
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
                        var index = model.addStorage.attractions.indexOf(title);
                        var latlng = model.addStorage.latlng[index];
                        if(index === -1){
                            index = model.currentCity.attractions.indexOf(title);
                            latlng = model.currentCity.latlng[index];
                        }
                        idStart.addClass(JSON.stringify(latlng));
                    });
                    $('.addEnd').on('click', function(){
                        idEnd.removeAttr('class');
                        var title = $(this).attr('id');
                        idEnd.val(title);
                        var index = model.addStorage.attractions.indexOf(title);
                        var latlng = model.addStorage.latlng[index];
                        if(index === -1){
                            index = model.currentCity.attractions.indexOf(title);
                            latlng = model.currentCity.latlng[index];
                        }
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
            viewMarkers.clearRender(placeMarkers);
            if (directionsDisplay != null) {
                directionsDisplay.setDirections({routes: []});
            }
            var currentCity = octopus.getCurrentCity();
            var markers = currentCity.markers;
            var bounds = new google.maps.LatLngBounds();
            var addStorage = octopus.getAddStorage();
            var markersForStorage = addStorage['markers'];
            // Extend the boundaries of the map for each marker and display the marker
            for (var i = 0; i < Math.max(markers.length, markersForStorage.length); i++) {
                if(markers[i]){
                    markers[i].setMap(map);
                    bounds.extend(markers[i].position);
                }
                if(markersForStorage[i]){
                    markersForStorage[i].setMap(map);
                    bounds.extend(markersForStorage[i].position);
                }

            }
            if(Math.max(markers.length, markersForStorage.length) > 0){
                map.fitBounds(bounds);
                showListing = true;
            } else {
                window.alert("No listing was found!");
            }
            // map.fitBounds(bounds);
            // showListing = true;
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
                        console.log("This infowindow already is on this marker!");
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
                        model.updateAddStroage({'lat': location.lat(), 'lng': location.lng()},place.name);
                        viewList.render();
                        if(!whichMarkers){
                            //when direction service is not working
                            octopus.loadMarkers(model.addStorage, '');
                        } else if(whichMarkers){
                            var index = idWaypoints[0].options.length -1;
                            console.log(idWaypoints[0].options[index]);
                            var thisOption = idWaypoints[0].options[index];
                            thisOption.selected = true;
                            secondClicked = true;
                            model.clicked.forEach(selected =>{
                                document.getElementsByClassName(selected.name)[0].selected = true;
                            });
                            idSubmit.click();
                        }
                    })
                }

            });
        }
    };

    var viewList = {
        render: function (){
            viewMarkers.clearRender(placeMarkers);
            idWaypoints.empty();
            var currentCity = octopus.getCurrentCity();
            currentCity.attractions.map(attraction => {
                idWaypoints.append('<option class="'+attraction+'"value="'+attraction+'">'+attraction+ '</option>');
            });
            var addStorage = octopus.getAddStorage();
            for(var i = 0; i < addStorage['attractions'].length; i++){
                idWaypoints.append('<option class="add '+addStorage['attractions'][i]+'" value="'+addStorage['attractions'][i]+'">'+addStorage['attractions'][i]+ '</option>');
            }
            octopus.initDirection();
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

    var view ={
        clear: function(){
            idShowMore.hide();
            placeMarkers = [];
            viewMarkers.clearRender(placeMarkers);
            viewMarkers.clearRender(model.addStorage.markers);
            viewMarkers.clearRender(model.currentCity.markers);
            viewMarkers.hideRender();
            // // Clear past routes
            // if (directionsDisplay != null) {
            //     console.log('isWorking?');
            //     directionsDisplay.setMap(null);
            //     directionsDisplay = null;
            // }
            octopus.clearClicked();
            octopus.clearAddStorage();
        }

    };



