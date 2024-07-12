document.addEventListener('DOMContentLoaded', (event) => {
    let chart1;
    let chart2;
    
    // Function to render or update the chart based on type
    const renderChart1 = (type, data) => {
        const labels = data.map(item => item['Key IDs']);
        const values = data.map(item => item['Total']);
        const offshoreValues = data.map(item => item['Offshore']);
        const onshoreValues = data.map(item => item['Onsite']);

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
            }, {
                label: 'Onshore',
                data: onshoreValues,
                backgroundColor: '#00e673',
                borderColor: '#00e673',
                borderWidth: 1,
                yAxisID: 'y-axis-1',
            }]
        };

        const chartOptions = {
            scales: {
                yAxes: [{
                    id: 'y-axis-1',
                    type: 'bar',
                    position: 'left',
                    ticks: {
                        beginAtZero: true,
                    }
                }]
            }
        };

        const chartContainer = document.getElementById('chart-container1');
        const canvas = document.createElement('canvas');
        canvas.id = 'myChart1';
        chartContainer.innerHTML = ''; // Clear previous content
        chartContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        if (chart1) {
            chart1.destroy(); // Destroy the existing chart before creating a new one
        }

        chart1 = new Chart(ctx, {
            type: type,
            data: chartData,
            options: chartOptions
        });
    };

    // Function to render or update the chart based on type
    const renderChart2 = (type, data) => {
        const experience = data.map(item => item['Exp']);

        // Initialize the labels array with values from 0 to the maximum value in experience
        const maxExperience = Math.max(...experience);
        const labels = Array.from({ length: maxExperience + 1 }, (_, i) => i);

        // Initialize the data array with zeros
        const data1 = Array(maxExperience + 1).fill(0);

        // Count the number of employees for each year of experience
        experience.forEach(exp => {
            data1[exp]++;
        });

        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Experience (Years)',
                data: data1,
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
                    type: 'bar',
                    position: 'left',
                    ticks: {
                        beginAtZero: true,
                    }
                }]
            }
        };

        const chartContainer = document.getElementById('chart-container2');
        const canvas = document.createElement('canvas');
        canvas.id = 'myChart2';
        chartContainer.innerHTML = ''; // Clear previous content
        chartContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        if (chart2) {
            chart2.destroy(); // Destroy the existing chart before creating a new one
        }

        chart2 = new Chart(ctx, {
            type: type,
            data: chartData,
            options: chartOptions
        });
    };

    // Fetch data from data1.json
    fetch('/static/data1.json')
        .then(response => response.json())
        .then(data => {
            renderChart1('bar', data); // Initial render with line chart and fetched data

            // Handle chart type change
            document.getElementById('chartType').addEventListener('change', (event) => {
                const selectedType = event.target.value;
                renderChart1(selectedType, data); // Update chart with selected type and fetched data
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    fetch('/static/data2.json')
        .then(response => response.json())
        .then(data => {
            renderChart2('bar', data); // Initial render with line chart and fetched data
            
            // Handle chart type change
            document.getElementById('chartType').addEventListener('change', (event) => {
                const selectedType = event.target.value;
                renderChart2(selectedType, data); // Update chart with selected type and fetched data
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});
