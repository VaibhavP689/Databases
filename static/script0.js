document.addEventListener('DOMContentLoaded', (event) => {
    let chart;
    
    // Function to render or update the chart based on type
    const renderChart = (type, data) => {
        const labels = data.map(item => item['Key IDs']);
        const values = data.map(item => item['Total']);
        const offshoreValues = data.map(item => item['Offshore']);

        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Total',
                data: values,
                backgroundColor: '#e31837',
                borderColor: '#e31837',
                borderWidth: 1,
                yAxisID: 'y-axis-1',
            }, {
                label: 'Offshore',
                data: offshoreValues,
                backgroundColor: '#3e95cd',
                borderColor: '#3e95cd',
                borderWidth: 1,
                yAxisID: 'y-axis-1',
            }]
        };

        const chartOptions = {
            scales: {
                yAxes: [{
                    id: 'y-axis-1',
                    type: 'linear',
                    position: 'left',
                    ticks: {
                        beginAtZero: true,
                    }
                }]
            }
        };

        const chartContainer = document.getElementById('chart-container');
        const canvas = document.createElement('canvas');
        canvas.id = 'myChart';
        chartContainer.innerHTML = ''; // Clear previous content
        chartContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        if (chart) {
            chart.destroy(); // Destroy the existing chart before creating a new one
        }

        chart = new Chart(ctx, {
            type: type,
            data: chartData,
            options: chartOptions
        });
    };

    // Fetch data from data1.json
    fetch('/static/data1.json')
        .then(response => response.json())
        .then(data => {
            renderChart('line', data); // Initial render with line chart and fetched data

            // Handle chart type change
            document.getElementById('chartType').addEventListener('change', (event) => {
                const selectedType = event.target.value;
                renderChart(selectedType, data); // Update chart with selected type and fetched data
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
