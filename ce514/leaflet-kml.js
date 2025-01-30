// Creating map options
var mapOptions = {
    center: [23.834012, 90.467032],
    zoom: 7
    }
    // Creating a map object
    var map = new L.map('map', mapOptions);
    // Creating a Layer object
    var layer = new L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

function kml_mapper(file, colorcode, infoBubble) {
    // Load kml file
    fetch(file)
        .then(res => res.text())
        .then(kmltext => {
            // Create new kml overlay
            const parser = new DOMParser();
            const kml = parser.parseFromString(kmltext, 'text/xml');
            const style_tag ='<styleUrl>#PolyStyle00</styleUrl>';
            if (style_tag in kml) {
                kml = kml.replace(style_tag, "");
            };
            const track = new L.KML(kml);
            track.setStyle({color:colorcode});
            track.bindPopup(infoBubble).openPopup();
            map.addLayer(track);

            // Adjust map to show the kml
            const bounds = track.getBounds();
            map.fitBounds(bounds);
        });
};
kml_mapper('Bangladesh.kml', '#0eaf88');

function geographySelector(evt, geographyName) {
    // Declare all variables
    const colors = {'Bangladesh': '#0eaf88', 'DhakaDivision': '#6413e2', 
        'DhakaDistrict': '#ef3510', 'TejgaonCircle': 'yellow'};
    const kml_files = {'Bangladesh': 'Bangladesh.kml', 'DhakaDivision': 'DhakaDivision.kml', 
        'DhakaDistrict': 'DhakaDistrict.kml', 'TejgaonCircle': 'TejgaonCircle.kml'};
    var infoBubble = geographyName + '; KML Filename: ' + kml_files[geographyName];
    kml_mapper(kml_files[geographyName], colors[geographyName], infoBubble);
    document.getElementById('forJS').innerHTML = ('<p> Layer drawn for <a href="' + kml_files[geographyName] + '" target="_blank"><b>' + 
        kml_files[geographyName] + '</a></b></p>');
  };


  
