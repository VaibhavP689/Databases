document.addEventListener('DOMContentLoaded', (event) => {
    let charts = {};
    let chartData;

    const variableColors = {
        'Total': '#e31837',
        'Offshore': '#3e95cd',
        'Onsite': '#00e673',
        'CW ID': '#ffa500',
        'ADID': '#800080',
        'RSA': '#00ced1',
        'CitrixLaptop': '#ff69b4'
    };

    // Function to render or update the chart based on type and selected variables
    const renderChart = (type, selectedVariables, containerId) => {
        const labels = chartData.map(item => item['Key IDs']);
        const datasets = selectedVariables.map(variable => ({
            label: variable,
            data: chartData.map(item => item[variable]),
            backgroundColor: variableColors[variable],
            borderColor: variableColors[variable],
            borderWidth: 1,
        }));

        const chartConfig = {
            type: type,
            data: { labels: labels, datasets: datasets },
            options: {
                scales: {
                    yAxes: [{
                        id: 'y-axis-1',
                        type: 'linear',
                        position: 'left',
                        ticks: { beginAtZero: true }
                    }]
                },
                maintainAspectRatio: true // Ensure the chart fits its container
            }
        };

        const chartContainer = document.getElementById(containerId);
        const canvas = document.createElement('canvas');
        canvas.id = `chart-${containerId}`;
        chartContainer.innerHTML = ''; // Clear previous content
        chartContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        if (charts[containerId]) {
            charts[containerId].destroy(); // Destroy the existing chart before creating a new one
        }

        charts[containerId] = new Chart(ctx, chartConfig);
    };

    // Fetch data from data1.json
    fetch('/static/data1.json')
        .then(response => response.json())
        .then(data => {
            chartData = data;
            document.getElementById('addWidget').addEventListener('click', () => {
                const dropdownContent = document.getElementById('dropdown-content');
                const selectedVariables = Array.from(dropdownContent.querySelectorAll('input[name="dataVariable"]:checked')).map(input => input.value);

                if (selectedVariables.length === 0) {
                    console.warn('Please select at least one variable');
                    alert('Please select at least one variable'); // Alert the user to select variables
                    return; // Exit the function if no variables are selected
                }

                const dashboard = document.getElementById('dashboard');
                const chartId = `chart-container-${Object.keys(charts).length}`;

                // Create a new row if needed
                let row = dashboard.lastElementChild;
                if (!row || row.childElementCount >= 4) {
                    row = document.createElement('div');
                    row.classList.add('chart-row');
                    dashboard.appendChild(row);
                }

                const chartContainer = document.createElement('div');
                chartContainer.classList.add('chart-style');
                chartContainer.id = chartId;
                row.appendChild(chartContainer);

                const chartType = document.getElementById('chartType').value;
                renderChart(chartType, selectedVariables, chartId);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});