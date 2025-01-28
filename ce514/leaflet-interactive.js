// Creating map options
var mapOptions = {
center: [23.834012, 90.467032],
zoom: 16.5
}
// Creating a map object
var map = new L.map('map', mapOptions);
// Creating a Layer object
var layer = new L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
var neighborhood = L.circle([23.83145937,90.46631213], 800).addTo(map).bindPopup('Neighborhood (within 10 minutes of walking distance or 800 meters)');
neighborhood.setStyle({color:'green'});
var home = L.polygon([[23.83140626,90.46625643], [23.83137785,90.46631787], [23.83149382,90.4663784], [23.83151475,90.46631149]]).addTo(map);
home.setStyle({color:'green'});
var schoolMarker = L.circleMarker([23.83099266,90.47123172]).addTo(map).bindPopup('Amirjan High School');;
schoolMarker.setStyle({color:'blue'});
var templeMarker = L.circleMarker([23.8340145,90.4669344]).addTo(map).bindPopup('Dumni Kali Mandir (Hindu Temple)');;
templeMarker.setStyle({color:'brown'});
var marketMarker = L.circleMarker([23.83101665,90.47234642]).addTo(map).bindPopup('Dumni Bazaar (Neighborhood Market)');;
marketMarker.setStyle({color:'darkslateblue'});
var homeMarker = L.circleMarker([23.83145677,90.46630177]).addTo(map).bindPopup('Home');
homeMarker.setStyle({color:'DarkSlateGray'});
map.fitBounds(neighborhood.getBounds());
function mapper(){
    var lat1 = parseFloat(document.getElementById('latitude1').value) * Math.PI / 180;
    var lon1 = parseFloat(document.getElementById('longitude1').value) * Math.PI / 180;
    var lat2 = parseFloat(document.getElementById('latitude2').value) * Math.PI / 180;
    var lon2 = parseFloat(document.getElementById('longitude2').value) * Math.PI / 180;
    marker1 = L.circleMarker([lat1 * 180 / Math.PI, lon1 * 180 / Math.PI], {title: 'Location 1'}).addTo(map).bindPopup('Location 1 (' + [lat1 * 180 / Math.PI, lon1 * 180 / Math.PI] + ')');
    marker1.setStyle({color:'green'});
    marker2 = L.circleMarker([lat2 * 180 / Math.PI, lon2 * 180 / Math.PI], {title: 'Location 2'}).addTo(map).bindPopup('Location 2 (' + [lat2 * 180 / Math.PI, lon2 * 180 / Math.PI] + ')');
    marker2.setStyle({color:'red'});
    var a = (Math.sin((lat1-lat2)/2))**2 + Math.cos(lat1) * Math.cos(lat2) * (Math.sin((lon1-lon2)/2))**2;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = 6371*c;
    var n = 20;
    great_circle_coordinates = [[lat1 * 180 / Math.PI, lon1 * 180 / Math.PI],];
    for (let i = 1; i <= n; i++) {
        f = i / (n+1);
        A = Math.sin((1-f)*c) / Math.sin(c);
        B = Math.sin(f*c) / Math.sin(c);
        x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
        y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
        z = A * Math.sin(lat1) + B * Math.sin(lat2);
        lat = Math.atan2(z, Math.sqrt(x**2 + y**2)) * 180 / Math.PI;
        lon = Math.atan2(y,x) * 180 / Math.PI;
        great_circle_coordinate = [lat, lon];
        great_circle_coordinates.push(great_circle_coordinate);
    };
    great_circle_coordinates.push([lat2 * 180 / Math.PI, lon2 * 180 / Math.PI]);
    document.getElementById('forJS').innerHTML = "<p>The distance between Location 1 and Location 2 is: <b>" + d + "</b> kilometers </p><br/>";
    // Adding layer to the map
    map.addLayer(layer);
    var great_circle_polyline = L.polyline(great_circle_coordinates,
        {color: 'blue'}
        ).addTo(map);
    map.fitBounds(great_circle_polyline.getBounds());
};
