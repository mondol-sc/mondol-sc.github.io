// Creating map options
var mapOptions = {
    center: [41.958049, -111.754751],
    zoom: 5.2
    };
    // Creating a map object
    var map = new L.map('map', mapOptions);
    // Creating a Layer object
    var layer = new L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            var statePolygon = L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/' + 
                'HS-9df066393124492c8eccf1230f3a7e11/wms', {
                layers: `HS-9df066393124492c8eccf1230f3a7e11:utah_state`,
                format: 'image/png',
                transparent: true,
                attribution: 'Hydroshare GeoServer'
            });
            statePolygon.addTo(map);
            const allReaches = ['3232569','1236065','3111399', '4931276', '1374334', '4605050','24558339','23503542','24166358'];
            for (let i = 0; i < allReaches.length; i++) {
                reach = allReaches[i];
                loadGeoJsonDefault(reach);
            }
    

function manageDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown'); // Select all dropdown elements
  
    dropdowns.forEach(dropdown => {
      const button = dropdown.querySelector('.dropdown-button'); // Element that triggers the dropdown (e.g., a button)
      const container = dropdown.querySelector('.dropdown-container'); // The actual dropdown content
  
      button.addEventListener('click', () => {
        // Check if the current dropdown is already active
        const isActive = dropdown.classList.contains('active');
  
        // Close all dropdowns
        dropdowns.forEach(otherDropdown => {
          if (otherDropdown !== dropdown && otherDropdown.classList.contains('active')) {
            otherDropdown.classList.remove('active');
            const otherContent = otherDropdown.querySelector('.dropdown-container');
            if(otherContent) otherContent.style.display = 'none'; // Hide content if needed
          }
        });
  
        // Toggle the current dropdown
        if (!isActive) {
          dropdown.classList.add('active');
          if(container) container.style.display = 'block';
        } else {
          dropdown.classList.remove('active');
          if(container) container.style.display = 'none';
        }
      });
  
    });
  }


  
manageDropdowns();

var trial = 0;
var activeReachID = 0;

var safeConditionElement = document.getElementById('safeCondition');
var floodConditionElement = document.getElementById('floodCondition');
var droughtConditionElement = document.getElementById('droughtCondition');
const all_datasets = [{
    label: 'Mean',
    data: [1,2,3,4,5],
    borderColor: '#03324e',
    borderWidth: 2,
    fill: false},
    {label: '',
    data: [1,2,3,4,5],
    borderColor: '#c30e0e',
    borderWidth: 1,
    fill: false},
    {label: 'Member 2',
    data: [1,2,3,4,5],
    borderColor: '#5c0099',
    borderWidth: 1,
    fill: false},
    {label: 'Member 3',
    data: [1,2,3,4,5],
    borderColor: '#0d41e1',
    borderWidth: 1,
    fill: false},
    {label: 'Member 4',
    data: [1,2,3,4,5],
    borderColor: '#72ce27',
    borderWidth: 1,
    fill: false},
    {label: 'Member 5',
    data: [1,2,3,4,5],
    borderColor: '#670d0b',
    borderWidth: 1,
    fill: false},
    {label: 'Member 6',
    data: [1,2,3,4,5],
    borderColor: '#ec458d',
    borderWidth: 1,
    fill: false}
];
const tableElement = document.getElementById('timeseries-datatable');
const chartElement = document.getElementById('mainGraph');
const errorElement = document.getElementById('IamError');
errorElement.style.display = 'none'
chartElement.style.display = 'none';
const ctx = chartElement.getContext('2d');
var timeseries_graph = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [1,2,3,4,5],
        datasets: all_datasets
        },
    options: {
        responsive: true,
        plugins: {
        title: {
            display: true,
            text: 'Streamflow Forecast',
            padding: {
                top: 10,
                bottom: 30
            }}},
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'Time'}
                },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Streamflow (cfs)'}    
                } 
            }
        }
    });

function NWMResultsExtractor(reachID, forecastType) {
    var floodCondition;
    var droughtCondition;
    activeReachID = reachID;
    geojson_filepath = `https://www.hydroshare.org/resource/9df066393124492c8eccf1230f3a7e11/data/contents/${reachID}.geojson`
    loadGeoJsonOnClick(geojson_filepath);
    switch (forecastType) {
        case "short_range": {
            var typeAccessor = "json_data.shortRange.series.data";
            var typeLabel = "Short Range (18 hours)";
            break;
        }
        case "medium_range": {
            var typeAccessor = "json_data.mediumRange";
            var typeLabel = "Medium Range (10 days)";
            break;
        }

        case "long_range": {
            var typeAccessor = "json_data.longRange";
            var typeLabel = "Long Range (30 days)";
            break;
        }

    }
    const accessURL = `https://api.water.noaa.gov/nwps/v1/reaches/${reachID}/streamflow?series=${forecastType}`;

    fetch(accessURL).then(response => {
        if (!response.ok) {
            throw new Error(`An HTTP error has been encountered. Error status: ${response.status}`);
        };
        return response.json();
        })
    .then(json_data => {
        var timestamps;
        var streamflowDataset = eval(typeAccessor);
        tableElement.style.display = 'block';
        const table = tableElement.getElementsByTagName('tbody')[0];
        if (trial > 0) {
            table.innerHTML = "";
        }
        var peakFlow;
        var minFlow;
        switch (forecastType) {
            case "short_range": {
                timestamps = streamflowDataset.map(item => item.validTime);
                const flowValues = streamflowDataset.map(item => item.flow.toFixed(2));
                const tableHeadRow = document.getElementById('thRow');
                tableHeadRow.innerHTML = '<th>Timestamp</th><th>Flow (cfs) </th>';
                for (let i = 0; i < timestamps.length; i++) {
                    const row = table.insertRow();
                    const timestampCell = row.insertCell();
                    const flowCell = row.insertCell();
                    timestampCell.textContent = timestamps[i] || ""; 
                    flowCell.textContent = flowValues[i] || ""; 
                };
                timeseries_graph.data.datasets = [all_datasets[0],];
                timeseries_graph.data.datasets[0].label = 'Short Range Forecast';
                timeseries_graph.data.datasets[0].data = flowValues;
                peakFlow = Math.max(...flowValues);
                minFlow = Math.min(...flowValues);
                break;
            }
            case "medium_range": {
                streamflowData = streamflowDataset.mean.data;
                timestamps = streamflowData.map(item => item.validTime);
                const mean = streamflowData.map(item => item.flow);
                for (let i = 0; i < timestamps.length; i++) {
                    const row = table.insertRow();
                    const timestampCell = row.insertCell();
                    const meanCell = row.insertCell();
                    timestampCell.textContent = timestamps[i] || ""; 
                    meanCell.textContent = meanCell[i] || "";
                };
                timeseries_graph.data.datasets[0].label = 'Mean of Six Members';
                timeseries_graph.data.datasets[0].data = mean;
                peakFlow = Math.max(...mean);
                minFlow = Math.min(...mean);
                break;
            }
            case "long_range": {
                streamflowData = streamflowDataset.mean.data;
                timestamps = streamflowData.map(item => item.validTime);
                if (timestamps.length==0) {throw new Error};
                const mean = streamflowData.map(item => item.flow.toFixed(2));
                streamflowData = streamflowDataset.member1.data;
                const member1 = streamflowData.map(item => item.flow.toFixed(2));
                streamflowData = streamflowDataset.member2.data;
                const member2 = streamflowData.map(item => item.flow.toFixed(2));
                streamflowData = streamflowDataset.member3.data;
                const member3 = streamflowData.map(item => item.flow.toFixed(2));
                streamflowData = streamflowDataset.member4.data;
                const member4 = streamflowData.map(item => item.flow.toFixed(2));
                const tableHeadRow = document.getElementById('thRow');
                const labels = ['Mean Member', 'Ensemble Member 1', 'Ensemble Member 2', 'Ensemble Member 3', 'Ensemble Member 4'];
                tableHeadRow.innerHTML = '<th>Timestamp</th><th>' + labels[0] + '</th><th>' + labels[1] + '</th><th>' + labels[2] + '</th><th>' + labels[3] + '</th><th>' + labels[4] + '</th>';
                
                for (let i = 0; i < timestamps.length; i++) {
                    const row = table.insertRow();
                    const timestampCell = row.insertCell();
                    const meanCell = row.insertCell();
                    const member1Cell = row.insertCell();
                    const member2Cell = row.insertCell();
                    const member3Cell = row.insertCell();
                    const member4Cell = row.insertCell();
                    timestampCell.textContent = timestamps[i] || ""; 
                    meanCell.textContent = mean[i] || "";
                    member1Cell.textContent = member1[i] || "";
                    member2Cell.textContent = member2[i] || "";
                    member3Cell.textContent = member3[i] || "";
                    member4Cell.textContent = member4[i] || "";
                };

                timeseries_graph.data.datasets = all_datasets.slice(0,5);
                timeseries_graph.data.datasets[0].label = labels[0];
                timeseries_graph.data.datasets[0].data = mean;
                timeseries_graph.data.datasets[1].label = labels[1];
                timeseries_graph.data.datasets[1].data = member1;
                timeseries_graph.data.datasets[2].label = labels[2];
                timeseries_graph.data.datasets[2].data = member2;
                timeseries_graph.data.datasets[3].label = labels[3];
                timeseries_graph.data.datasets[3].data = member3;
                timeseries_graph.data.datasets[4].label = labels[4];
                timeseries_graph.data.datasets[4].data = member4;
                combinedFlowArray = [...mean, ...member1, ...member2, ...member3, ...member4];
                peakFlow = Math.max(...combinedFlowArray);
                minFlow = Math.min(...combinedFlowArray);
                break;
                
            }
        };

        fetch('https://hydroshare.org/resource/9df066393124492c8eccf1230f3a7e11/data/contents/reaches_info.json')
        .then(response => response.json())
        .then(reaches_info => {
            var reachIDnum = parseInt(reachID);
            reachData = eval(`reaches_info.RID${reachIDnum}`);;
            var reachName = reachData.name;
            document.getElementById("resultHeader").innerHTML = `Showing results for <b>${reachName}</b> >> ${typeLabel}`;
            var return_periods_obj = {rp2: ["2-year flood", reachData.return_period_2], rp5: ["5-year flood", reachData.return_period_5], rp10: ["10-year flood", reachData.return_period_10], rp25: ["25-year flood", reachData.return_period_25], rp50: ["50-year flood", reachData.return_period_50], rp100: ["100-year flood", reachData.return_period_100]};
            document.getElementById('return_period_table').innerHTML = `<table><tr><th>Label</th><th>Flow (cfs)</th></tr><tr><td>${return_periods_obj.rp2[0]}</td><td>${return_periods_obj.rp2[1]}</td></tr><tr><td>${return_periods_obj.rp5[0]}</td><td>${return_periods_obj.rp5[1]}</td></tr><tr><td>${return_periods_obj.rp10[0]}</td><td>${return_periods_obj.rp10[1]}</td></tr><tr><td>${return_periods_obj.rp25[0]}</td><td>${return_periods_obj.rp25[1]}</td></tr><tr><td>${return_periods_obj.rp50[0]}</td><td>${return_periods_obj.rp50[1]}</td></tr><tr><td>${return_periods_obj.rp100[0]}</td><td>${return_periods_obj.rp100[1]}</td></tr><tr><td>Drought Threshold (Q80)</td><td>${reachData.p80}</td></tr></table>`;
            yMin = timeseries_graph.scales.y.min;
            yMax = timeseries_graph.scales.y.max;
            yRange = yMax - yMin;
            for (const key in return_periods_obj) {
                if (return_periods_obj.hasOwnProperty(key)) {
                    if (return_periods_obj[key][1] >= yMin-yRange/2 && return_periods_obj[key][1] <= yMax+yRange/2) {
                        // Add a new dataset later
                        if (peakFlow >= return_periods_obj[key][1]) {
                            floodCondition = return_periods_obj[key][0];
                        }

                        color = {'100-year flood': '#FF1A00', '50-year flood': '#FF4100', '25-year flood': '#FF6400', '10-year flood': '#FF8200', '5-year flood': '#FFA000', '2-year flood': '#FFC800'}
                        const rpLine = {
                            label: return_periods_obj[key][0],
                            data: Array(timestamps.length).fill(return_periods_obj[key][1]),
                            borderColor: color[return_periods_obj[key][0]],
                            fill: false
                        };
                        console.log(peakFlow)
                        timeseries_graph.data.datasets.push(rpLine);
                    
                    
                    }

                }
            }
            if (floodCondition) {
                floodConditionElement.style.display = 'block';
                floodConditionElement.innerHTML = `<h2>Flood Condition Prevails</h2><p style="text-align:justified">The forecasted streamflow exceeds the <span style="font-weight:bold; color:${color[floodCondition]}">${floodCondition}</span>. So, take necessary measurements to deal with it or even to evacuate. </p>`;
                safeConditionElement.style.display = 'none';
                droughtConditionElement.style.display = 'none';
            }
            if (minFlow - yRange/2 <= reachData.p80) {
                // Add a new dataset later
                const drLine = {
                    label: "Drought Threshold (Q80)",
                    data: Array(timestamps.length).fill(reachData.p80),
                    borderColor: `#858C95`,
                    fill: false
                };
                
                if (minFlow <= reachData.p80) {
                    droughtCondition = "Drought Condition Prevails";
                    droughtConditionElement.style.display = 'block';
                    droughtConditionElement.innerHTML = `<h2>${droughtCondition}</h2><p style="text-align:justified">The forecasted streamflow falls below the fixed threshold value computed for this particular reach from the historical dataset. So, there exists a <b>streamflow drought</b> in this reach. </p>`;
                    floodConditionElement.style.display = 'none';
                    safeConditionElement.style.display = 'none';
                }

                console.log(drLine)
                timeseries_graph.data.datasets.push(drLine);
    
            
            } 
            if (droughtCondition === undefined && floodCondition === undefined){
                safeConditionElement.style.display = 'block';
                safeConditionElement.innerHTML = `<h2>Safe and Sound Condition</h2><p>This reach is safe for regular activities within the forecasted window since there is no sign of flood or drought as per the forecast.</p>`;
                floodConditionElement.style.display = 'none';
                droughtConditionElement.style.display = 'none';
            }

            timeseries_graph.update();
        })
        .catch(error => console.error('Error reading JSON:', error));
        timeseries_graph.data.labels = timestamps;

        timeseries_graph.update();
        if (chartElement.style.display==='none') {chartElement.style.display = 'block';};  
        trial += 1;
        errorElement.style.display = 'none';
        }
    ).catch(error => {
        console.error('Error fetching or processing data:', error);
        chartElement.style.display = 'none';
        tableElement.style.display = 'none';
        errorElement.style.display = 'block';
});

}

function extractForecastOnClick (element, reachID) {
    const forecastType = document.getElementById("forecastSelector").value;
    const aTags = document.getElementsByTagName("a");
    removeAnchorStyles('dropdown1');
    removeAnchorStyles('dropdown2');
    removeAnchorStyles('dropdown3');
    element.style.backgroundColor = "#2a9d8f";

    NWMResultsExtractor(reachID, forecastType);
}

function extractForecastOnChange (forecastType) {
    let myreach;
    if (activeReachID===0) {
        myreach = '4931276';
    }
    else {
        myreach = activeReachID;
        
    };
    
    NWMResultsExtractor(myreach, forecastType);
}


function loadGeoJsonDefault(reach) {
    var reach_filepath = `https://www.hydroshare.org/resource/9df066393124492c8eccf1230f3a7e11/data/contents/${reach}.geojson`;
  fetch(reach_filepath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
        const geojsonLayer = L.geoJSON(data, {
            style: function (feature) {
              return {
                fillColor: '#ff7800',
                weight: 7,
                opacity: 1,
                color: '#884ea0',
                fillOpacity: 0.7
              };
            },
            onEachFeature: function (feature, layer) {
              if (feature.properties && feature.properties.name) {
                layer.bindPopup(
                    '<div>' +
                    '<h4>' + feature.properties.name + '</h4>' + // Replace 'name' with the property you want to display
                    '<button onclick="extractForecastOnClick(this,'+reach+')">Show Results</button>' +
                    '</div>'
                );
              }
            }
          });
    
          // Add the layer to the map
          geojsonLayer.addTo(map);
    
    
    })
    .catch(error => {
      console.error('Error loading GeoJSON:', error);
    });
}

let geojsonFocusLayer;
function loadGeoJsonOnClick(filePath) {
    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (geojsonFocusLayer) {
            map.removeLayer(geojsonFocusLayer);
          }

          geojsonFocusLayer = L.geoJSON(data, {
              style: function (feature) {
                return {
                  fillColor: '#ff7800',
                  weight: 25,
                  opacity: 0.3,
                  color: '#884ea0',
                  fillOpacity: 0.7
                };
              },
              onEachFeature: function (feature, layer) {
                if (feature.properties && feature.properties.name) {
                    layer.bindPopup(
                        '<div>' +
                        '<h4>' + feature.properties.name + '</h4>' + // Replace 'name' with the property you want to display
                        '<button onclick="extractForecastOnClick(this,'+reach+')">Show Results</button>' +
                        '</div>'
                    );
                    layer.openPopup();
                }
              }
            });
            // Add the layer to the map
            geojsonFocusLayer.addTo(map);
      
            // Zoom to the extent of the GeoJSON layer
            map.fitBounds(geojsonFocusLayer.getBounds()); //This is the most important addition.
      
      })
      .catch(error => {
        console.error('Error loading GeoJSON:', error);
      });
  }


  



  function removeAnchorStyles(outerDivId) {

    const outerDiv = document.getElementById(outerDivId);
  
    if (!outerDiv) {
      console.error(`Div with ID "${outerDivId}" not found.`);
      return;
    }
  
    const anchorTags = outerDiv.querySelectorAll('a');
  

    anchorTags.forEach(anchor => {
      anchor.removeAttribute('style');
    });
  }

  function bglayerMapper(stateName){
    if (statePolygon){
        map.removeLayer(statePolygon)
    }
    statePolygon = L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/' + 
        'HS-9df066393124492c8eccf1230f3a7e11/wms', {
        layers: `HS-9df066393124492c8eccf1230f3a7e11:${stateName}`,
        format: 'image/png',
        transparent: true,
        attribution: 'Hydroshare GeoServer'
    });
    if ((toggleCount+1)%2===0){
        statePolygon.addTo(map);
    }
  }

  var toggleCount = 1;
  function toggleBGLayer(){
    toggleCount += 1;
    if (toggleCount%2===0){
        map.removeLayer(statePolygon);
    }
    else{
        statePolygon.addTo(map);
    }
    
  }
  
  