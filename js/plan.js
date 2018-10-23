// Global variable: map
var map;
var largeInfowindow;
var vm;

// init
function init() {
    var styles = model.style();
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 61.356137, lng: -112.396204},
        zoom: 5,
        styles: styles,
        mapTypeControl: false
    });
    vm = new ViewModel();
    ko.applyBindings(vm);
    View(vm.currentCity());
    largeInfowindow = new google.maps.InfoWindow({
        maxWidth: 200
    });
}


var designMarkers = function(info){
    var defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

    var markers = [];

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
        markers.push(marker);
        // if (largeInfoWindow) {
        //     var largeInfowindow = new google.maps.InfoWindow();
        // }

        // Create an onclick event to open the large infowindow at each marker and
        // create toggle bounce once the marker is clicked.
        marker.addListener('click', function () {
            currentAttraction(this);
            toggleBounce(this);
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

    return markers
};

function currentAttraction(marker){
    vm.currentAttraction(marker.title);
}

function toggleBounce(marker){
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){ marker.setAnimation(null); }, 1500);
    }
}

function makeMarkerIcon (markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
    return markerImage;
}

function populateInfoWindow (marker, infowindow) {
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
                infowindow.setContent('<div id="infoWindow"><div class="wiki-description"></div><div id="pano"></div></div>');
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                var panorama = new google.maps.StreetViewPanorama(
                    document.getElementById('pano'), panoramaOptions);
                wikiAPI(marker.title)
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
};


function wikiAPI(attraction){


    var $wikiElem = $('.wiki-description');

    // clear out old data before new request
    $wikiElem.text("");

//get New York Times article through AJAX request

    var attractionWithNoSpace = [];
    attraction.split('').forEach(char => {
        char === ' ' ? attractionWithNoSpace.push('%20') : attractionWithNoSpace.push(char);
    });
    attractionWithNoSpace=attractionWithNoSpace.join('');

    //get Wikipedia Results according to the typed address

    var wikiurl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='+ attractionWithNoSpace+"&callback=callback";
    var wikiRequestTimeOut = setTimeout(function(){
        $wikiElem.text('Failed to load Wikipedia resources.');
    }, 8000);

    $.ajax({
        url: wikiurl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function(response){
            var wikiList = response[1];
            var description = response[2][0];
            if (wikiList.length === 0){
                $wikiElem.text('Sorry, no result was found for ' + attraction);
            } else {
                var wikiList = wikiList[0]
                var searchURL = "https://en.wikipedia.org/wiki/" + wikiList;
                $wikiElem.append('<strong><a href="'+searchURL+' " target="_blank" style="color:darkred;">'+ wikiList+':' +'</a></strong><span>'+description+'</span>')
                clearTimeout(wikiRequestTimeOut);
            }
        }
    });

    return false;
};

function weatherAPI (city){
    var apiKey = 'YOUR API KEY';
    if (city === 'Quebec City'){
        weatherurl='http://api.openweathermap.org/data/2.5/weather?q=quebec'+',ca&units=metric&APIKEY=' + apiKey
    } else {
        weatherurl = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + ',ca&units=metric&APIKEY=' + apiKey
    }
    // ajax 'get' request
    $.ajax({
        type: 'GET',
        url: weatherurl,
        success: function(data){
            vm.weather(new Weather(data))
        },
        error: function(error){
            vm.weather('')
        }
    })

}

// an instance of a user-defined object type: weather
var Weather = function(data){
    // If ajax GET request fails, empty the weather html section
    if (data === ''){
        this.iconurl = '';
        this.weatherStatus = '';
        this.temp = '';
        this.temp_min = '';
        this.temp_max = '';
        this.wind = ''
    } else {
        // if ajax GET request succeeds,
        icon = data['weather'][0]['icon'];
        this.iconurl= 'http://openweathermap.org/img/w/' + icon + '.png';
        this.weatherStatus= data['weather'][0]['main'];
        this.temp= data['main']['temp'];
        this.humidity= data['main']['humidity'];
        this.temp_min= data['main']['temp_min'];
        this.temp_max= data['main']['temp_max'];
        this.wind= data['wind']['speed'];
    }
};



/* View Model */
var ViewModel = function() {
    var that = this;
    this.cityList = ko.observableArray([]);
    // Update city list using data stored in CanadaData
    canadaData.forEach(city => {
        that.cityList.push({
            "name": city.name,
            "attractions": city['attractions'],
            "latlng": city.latlng
        });
    });

    this.currentCity = ko.observable(that.cityList()[0]);
    this.markers = ko.observableArray([]);
    this.weather = ko.observable();
    this.changeCurrentCity = function(city){
        that.currentCity(city);
        that.markers(View(that.currentCity()));
        weatherAPI(that.currentCity().name);

    };
    this.changeCurrentCity(that.currentCity())
    this.loadArticles = function(attraction){
        wikiAPI(attraction);
        that.markers().forEach(marker => {
            if (marker.title === attraction) {
                new google.maps.event.trigger( marker, 'click' );
            }
        })
    };

    this.currentAttraction = ko.observable('');
};

/* View for markers */
var View = function(data){
    var that = this;
    var bounds = new google.maps.LatLngBounds();
    var markers = designMarkers(data);
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds, 0);
    return markers
};






