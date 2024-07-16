document.addEventListener('DOMContentLoaded', (event) => {
    let charts = {};
    let chartData;
    let deleteMode = false;
    let originalChartConfigs = {};

    const variableColors = {
        'Total': '#e31837',
        'Offshore': '#3e95cd',
        'Onsite': '#00e673',
        'CW ID': '#ffa500',
        'ADID': '#800080',
        'RSA': '#00ced1',
        'CitrixLaptop': '#ff69b4'
    };

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
                //scales: {
                    //yAxes: [{
                        //id: 'y-axis-1',
                        //type: 'linear',
                        //position: 'left',
                        //ticks: { beginAtZero: true }
                    //}]
                //},
                maintainAspectRatio: false
            }
        };

        const chartContainer = document.getElementById(containerId);
        const canvas = document.createElement('canvas');
        canvas.id = `chart-${containerId}`;
        chartContainer.innerHTML = ''; 
        chartContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');

        if (charts[containerId]) {
            charts[containerId].destroy(); 
        }

        charts[containerId] = new Chart(ctx, chartConfig);
    };

    const toggleDeleteMode = () => {
        deleteMode = !deleteMode;
        if (deleteMode) {
            originalChartConfigs = Object.keys(charts).reduce((acc, containerId) => {
                const chart = charts[containerId];
                acc[containerId] = {
                    type: chart.config.type,
                    selectedVariables: chart.config.data.datasets.map(dataset => dataset.label)
                };
                return acc;
            }, {});
        }

        for (const containerId in charts) {
            const chartContainer = document.getElementById(containerId);
            if (deleteMode) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'control-button';
                deleteBtn.innerText = 'Delete';
                deleteBtn.onclick = () => {
                    delete charts[containerId];
                    chartContainer.remove();
                };
                chartContainer.innerHTML = ''; 
                chartContainer.appendChild(deleteBtn);
            } else {
                const config = originalChartConfigs[containerId];
                if (config) {
                    renderChart(config.type, config.selectedVariables, containerId);
                }
            }
        }
    };

    document.getElementById('deleteButton').addEventListener('click', toggleDeleteMode);

    const saveCharts = () => {
        const chartConfigs = Object.keys(charts).map(containerId => {
            const chart = charts[containerId];
            return {
                type: chart.config.type,
                selectedVariables: chart.config.data.datasets.map(dataset => dataset.label),
                containerId: containerId
            };
        });

        fetch('/save-charts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chartConfigs)
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Charts saved successfully') {
                alert('Charts saved successfully!');
            } else {
                alert('Failed to save charts.');
            }
        })
        .catch(error => {
            console.error('Error saving charts:', error);
            alert('Error saving charts.');
        });
    };

    document.getElementById('exportButton').addEventListener('click', saveCharts);

    const loadCharts = () => {
        fetch('/load-charts')
            .then(response => response.json())
            .then(chartConfigs => {
                chartConfigs.forEach(config => {
                    const { type, selectedVariables, containerId } = config;
                    const dashboard = document.getElementById('dashboard');
                    let chartContainer = document.getElementById(containerId);
                    if (!chartContainer) {
                        // Create a new row if needed
                        let row = dashboard.lastElementChild;
                        if (!row || row.childElementCount >= 4) {
                            row = document.createElement('div');
                            row.classList.add('chart-row');
                            dashboard.appendChild(row);
                        }

                        chartContainer = document.createElement('div');
                        chartContainer.classList.add('chart-style');
                        chartContainer.id = containerId;
                        row.appendChild(chartContainer);
                    }

                    renderChart(type, selectedVariables, containerId);
                });
            })
            .catch(error => {
                console.error('Error loading charts:', error);
                alert('Error loading charts.');
            });
    };

    document.getElementById('loadButton').addEventListener('click', loadCharts);

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
                    alert('Please select at least one variable'); 
                    return; 
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
