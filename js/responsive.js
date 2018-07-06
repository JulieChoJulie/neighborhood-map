$('.fa-times').on('click', function() {
    $('.options-box').hide();
    $('.title-hamburger-icon').show();
    $('#map').css("left", "0px");
});

$('#hamburger-icon').on('click', function(){
    $('.options-box').show();
    $('.title-hamburger-icon').hide();
    $('#map').css("left", "362px");
});
