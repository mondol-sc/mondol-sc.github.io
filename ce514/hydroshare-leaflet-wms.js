var map = L.map('map').setView([34.0479,100.6197], 2.1); 

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const asiaPolygon = L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-87e1889c6a4f4610b22fb7ce36bfd6fd/wms', {
            layers: 'HS-87e1889c6a4f4610b22fb7ce36bfd6fd:Asia',
            format: 'image/png',
            transparent: true,
            attribution: 'Hydroshare GeoServer'
        });
        asiaPolygon.addTo(map);
  
        var tracker = 1;

        function explorer() {
            if (tracker==1) {
                map.removeLayer(asiaPolygon);
                const places = [];
                const paths = ["IstanbulToAstrakhan", "AstrakhanToSamarkand", "SamarkandToKabul", "KabulToDelhi", "DelhiToCalicut", "CalicutToChittagong", "ChittagongToSingapore", "SingaporeToQuanzhou", "QuanzhouToGuangzhou", "GuangzhouToBeijing"];
                for (let i=0; i<=paths.length; i++) {
                    const path = paths[i];
                    const place = path.split("To")[0];
                    places.push(place);
                    const placeLayerName = 'HS-87e1889c6a4f4610b22fb7ce36bfd6fd:' + place;
                    const placeLayer = L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-87e1889c6a4f4610b22fb7ce36bfd6fd/wms', {
                        layers: placeLayerName,
                        format: 'image/png',
                        transparent: true,
                        attribution: 'Hydroshare GeoServer'
                    });
                    placeLayer.addTo(map);

                    const pathLayerName = 'HS-87e1889c6a4f4610b22fb7ce36bfd6fd:' + path;
                    const pathLayer = L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-87e1889c6a4f4610b22fb7ce36bfd6fd/wms', {
                        layers: pathLayerName,
                        format: 'image/png',
                        transparent: true,
                        attribution: 'Hydroshare GeoServer'
                    });

                    pathLayer.addTo(map);

                    if (i == paths.length){
                        const place = path.split("To")[1];
                        places.push(place);
                        const placeLayerName = 'HS-87e1889c6a4f4610b22fb7ce36bfd6fd:' + place;
                        const placeLayer = L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-87e1889c6a4f4610b22fb7ce36bfd6fd/wms', {
                            layers: placeLayerName,
                            format: 'image/png',
                            transparent: true,
                            attribution: 'Hydroshare GeoServer'
                        });
                        placeLayer.addTo(map);

                    };
                    document.getElementById('forJS').innerHTML = '<p><b>Paths: </b>' + paths + '<br/>' + '<b>Places:</b> ' + places + '</p>';
                    
                    
                };   
            };
            tracker += 1;
        };