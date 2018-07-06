
$('#zoom-to-area').on('click', function(){
    //get Wikipedia Results according to the typed address
    var cityStr = $('#zoom-to-area-text').val();
    var cityNameWithNoSpace = [];
    cityStr.split('').forEach(char => {
        char === ' ' ? cityNameWithNoSpace.push('_') : cityNameWithNoSpace.push(char);
    });

    var wikiurl = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search='+cityNameWithNoSpace.join('')+"_attractions"+"&callback=callback";
    var wikiRequestTimeOut = setTimeout(function(){
        $wikiElem.text('Failed to load Wikipedia resources.');
    }, 8000);

    $.ajax({
        url: wikiurl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function(response){
            var wikiList = response[1];
            if (wikiList.length === 0){
                $wikiElem.text('Sorry, no result was found for your address: ' + address);
            }
            wikiList.forEach(wiki => {
                var searchURL = "https://en.wikipedia.org/wiki/" + wiki;
                $('#waypoints').append('<option value="'+wiki+'">'+wiki+ '</option>');
            });
            clearTimeout(wikiRequestTimeOut);
        }
    });
});