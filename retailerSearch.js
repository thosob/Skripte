<script src="https://maps.googleapis.com/maps/api/js?v=3.exp?key=AIzaSyC0MEvqlq4CCIN6ksgN-P31n_iiTBnbDkQ"></script>
<script src="https://aqualight.de/download/lib/markerClusterer/markerClusterer.js"></script>

<script>
	var geocoder;
	var map;
	var mc;
	var idArray = Array();
	var contentArray = Array();
	var companyArray = Array();
	var postcodeArray = Array();
	var streetArray = Array();
	var countryArray = Array();
	var cityArray = Array();
	var addressArray = Array();
	var locationArray = Array();
	var langitudeArray = Array();
	var latitudeArray = Array();
	var markerArray = Array();
	var distanceArray = Array();
	var count;
	var visitorLatitude;
	var visitorLongitude;
	var clickOnDistance = false;


jQuery(document).ready(function(){
	
	function getLocation() {
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(showPosition);
	    }
	}
	
	function showPosition(position) {
	    visitorLatitude =  position.coords.longitude;
	    visitorLongitude =  position.coords.latitude;
	    codeAddress(visitorLatitude, visitorLongitude);
	    visitorLatitude = 0; 
	    visitorLongitude = 0;
	}
	
	getLocation();
});



function initialize() {
	
    count = $("integer").textContent;
    var infowindow =  new google.maps.InfoWindow();
    geocoder = new google.maps.Geocoder();
    var mapProp = {
        center:new google.maps.LatLng(52.421214, 8.058878),
        zoom:6,
        mapTypeId:google.maps.MapTypeId.HYBRID
    };

    map = new google.maps.Map(document.getElementById("googleMap"),mapProp);  
    var marker=new google.maps.Marker({
				map: map,
        position: ({lat: 52.421214, lng: 8.058878}),
        open: true
    });
    marker.setMap(map);
    markerArray.push(marker);
    getMarkers();
    for(var k = 0; k < count; k++){
	if(latitudeArray[k] && streetArray[k] != "Am Basterpohl 6"){
            var hmarker = new google.maps.Marker({
                map: map,
                position: ({lat: Number(langitudeArray[k]), lng: Number(latitudeArray[k])}), 	//Längen und Breitengerade vertauscht :D
		open: false,
		content: contentArray[k]
            });
            hmarker.setMap(map);
            markerArray.push(hmarker);
            google.maps.event.addListener(hmarker, 'click', function() {
                if(!this.open){
                    infowindow.setContent(this.content);
                    this.open = true;
                    map.setCenter(this.getPosition());
                    infowindow.open(map, this);
                }
                else{
                    infowindow.setContent(this.content);
                    this.open = false;
                    infowindow.close(map, this);
                }
            });
        }
    }

  var infowindow2 = new google.maps.InfoWindow({
    content:"<table class=\"table\"><tr><td>Aqualight GmbH</td></tr><tr><td>Am Basterpohl 6<br/>49191 Bramsche<br/></td></tr></table>"
  });
 
    google.maps.event.addListener(marker, 'click',function() {
        if(!marker.open){
                marker.open = true;
                map.setCenter(marker.getPosition());
                infowindow2.open(map, marker);
        }else{
                marker.open = false;
                infowindow2.close(map, marker);
        }
    });
    infowindow2.open(map,marker);
	mc = new MarkerClusterer(map,markerArray);

}

function getMarkers(){

  for(var j = 0; j < count; j++){
				idArray[j] = $("id"+j).textContent;
        companyArray[j] = $("comp"+j).textContent;
        postcodeArray[j] = $("post"+j).textContent;
        streetArray[j] = $("street"+j).textContent;
        countryArray[j] = $("country"+j).textContent;
        cityArray[j] = $("city"+j).textContent;
        addressArray[j] = streetArray[j]+" "+postcodeArray[j]+" "+cityArray[j]+" "+countryArray[j];
        contentArray[j] = "<table class=\"table\"><tr><th><b>"+companyArray[j]+"</b></th></tr><tr><td>"+streetArray[j]+"<br/>"+postcodeArray[j]+" "+cityArray[j]+"<br/></td></tr></table>";
        if(isNaN($("langitude"+j))){
                langitudeArray[j] = $("langitude"+j).textContent;
                latitudeArray[j] = $("latitude"+j).textContent;
        }
        else{
                langitudeArray[j] = 0;
                latitudeArray[j] = 0;
                console.log("Info: "+j);
        }
    }
}


function codeAddress(longitude, latitude) {
    var i = 0;
    var address = document.getElementById('address').value;
    var infowindow2 = new google.maps.InfoWindow;
    var longlat = new google.maps.LatLng(latitude, longitude);

    if(longitude > 0 && latitude > 0){	
        map.setCenter(longlat);
        map.setZoom(14);
        var marker = new google.maps.Marker({
            open: true,
            map: map,
            position: longlat
        });
					
	google.maps.event.addListener(marker, 'click',function() {
            if(!marker.open){
		marker.open = true;
		map.setCenter(marker.getPosition());
		infowindow2.open(map, marker);
            }
            else{
                marker.open = false;
                infowindow2.close(map, marker);
            }
        });
        infowindow2.open(map,marker);
        infowindow2.setContent("<b>Ihr Standort</b>");   
        console.log(longlat);
        updateDistanceMatrix(longitude, latitude);	
				orderDistance();
    }
    else{
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                map.setCenter(results[0].geometry.location);
                map.setZoom(14);
                var marker = new google.maps.Marker({
                    open: true,
                    map: map,
                    position: results[0].geometry.location
                });
                google.maps.event.addListener(marker, 'click',function() {
                    if(!marker.open){
                        marker.open = true;
                        map.setCenter(marker.getPosition());
                        infowindow2.open(map, marker);
                    }
                    else{
                        marker.open = false;
                        infowindow2.close(map, marker);
                    }
                });
                infowindow2.open(map,marker);
                infowindow2.setContent("<b>Ihr Standort</b>");
                updateDistanceMatrix( marker.position.L, marker.position.H);
            		orderDistance();
						}
            else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }
}
/**
* @brief orders distance by clicking on th
*/
function orderDistance(){

		if(clickOnDistance){
			jQuery('#Distance').click();
			jQuery('#Distance').click();
		}else{
			jQuery('#Distance').click();
			clickOnDistance = true;
		}
}
/**
* @brief updates the distance
* @param {type} longlat
* @returns nothing
**/
function updateDistanceMatrix(x1, x2){
        
        for(var i = 0; i < langitudeArray.length; i++){            
            distanceArray[i] = getDistance(x1,x2, latitudeArray[i], langitudeArray[i]);
            //console.log("Latitude: "+latitudeArray[i]);
            //console.log("Langitude: "+ langitudeArray[i]);
            jQuery("#distance_"+idArray[i]).text(Math.ceil(distanceArray[i]));
        }		
}
/**
* @brief gets the distance of all customers
*/
function getDistance(x1, x2, y1, y2){
	var euklidischerAbstand = Math.sqrt(Math.pow(71.5*(x1-y1),2) + Math.pow(111.3*(x2-y2), 2));
        //console.log("X1: "+x1+" X2: "+x2+" Y1: "+y1+" Y2: "+y2);
        //console.log("Euklidischer Abstand: "+euklidischerAbstand)
	return euklidischerAbstand;
}


google.maps.event.addDomListener(window, 'load', initialize);
</script>


<script>
//Click-Functions
//Reminder: JQuery muss in Magento extra ausgewiesen werden
jQuery('th').click(function(){
    var table = jQuery(this).parents('table').eq(0);
    var rows = table.find('tr:gt(0)').toArray().sort(comparer(jQuery(this).index()));
    this.asc = !this.asc;
    if (!this.asc){
        rows = rows.reverse();
    }
    for (var i = 0; i < rows.length; i++)
    {
        table.append(rows[i]);
    }
});
function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index);
        return jQuery.isNumeric(valA) && jQuery.isNumeric(valB) ? valA - valB : valA.localeCompare(valB);
    };
}
function getCellValue(row, index){ 
    return jQuery(row).children('td').eq(index).html();
}

</script>