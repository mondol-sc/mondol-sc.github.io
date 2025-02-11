function NWMResultsExtractor() {
    const reachID = parseInt(document.getElementById("reachID").value);
    const accessURL = `https://api.water.noaa.gov/nwps/v1/reaches/${reachID}/streamflow?series=short_range`;

    fetch(accessURL).then(response => {
        if (!response.ok) {
            throw new Error(`An HTTP error has been encountered. Error status: ${response.status}`);
        };
        return response.json();
        })
    .then(json_data => {
        const streamflowData = json_data.shortRange.series.data;
        const timestamps = streamflowData.map(item => item.validTime);
        const flowValues = streamflowData.map(item => item.flow);
        
        const tableElementCatcher = document.getElementById('timeseries-datatable');
        tableElementCatcher.style.display = 'block';
        const table = tableElementCatcher.getElementsByTagName('tbody')[0];
        const maxLength = Math.max(timestamps.length, flowValues.length);
        for (let i = 0; i < maxLength; i++) {
            const row = table.insertRow();
            const timestampCell = row.insertCell();
            const flowCell = row.insertCell();
            if (i==0) {
                const chart = row.insertCell();
                chart.innerHTML = '<canvas id="streamflowChart"></canvas>';
                chart.rowSpan = '18';
                chart.columnWidth = '900px';
            }
            timestampCell.textContent = timestamps[i] || ""; 
            flowCell.textContent = flowValues[i] || ""; 
        };
        

        const chartElementCatcher = document.getElementById('streamflowChart');
        const ctx = chartElementCatcher.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: timestamps,
                datasets: [{
                    label: 'Streamflow Forecast (Short Range)',
                    data: flowValues,
                    borderColor: 'teal',
                    borderWidth: 1,
                    fill: false}]
                },
            options: {
                responsive: true,
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
        }
    ).catch(error => {
        console.error('Error fetching or processing data:', error);
        const chartCanvas = document.getElementById('streamflowChart');
        chartCanvas.innerHTML = "<p>Error loading chart</p>";

});

}