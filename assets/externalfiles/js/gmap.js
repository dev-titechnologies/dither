//contact google map

// These are the values for your desired longitude and latitude
var lat=51.508742;
var long=-0.120850;   

if ($("#googleMap").length > 0)
{
    var myCenter = new google.maps.LatLng(
        lat, long 
    );
    function changeMarker(newLogo) {
        "use strict";
        var marker = new google.maps.Marker({
            position: myCenter,
            icon: newLogo
        });
        var map = new google.maps.Map(document.getElementById("googleMap"), {
            center: myCenter,
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            scrollwheel: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            styles: [{
                    "featureType": "all",
                    "stylers": [
                        {"saturation": -100}
                    ]
                }]
        });
        marker.setMap(map);
    }

    google.maps.event.addDomListener(window, "load", function () {
        changeMarker("img/contact/location-color-1.png");
    });
}
