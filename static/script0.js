document.addEventListener('DOMContentLoaded', (event) => {
    let charts = {};
    let chartData = {};
    let deleteMode = false;
    let originalChartConfigs = {};

    const variableColors = {
        'UPS Client Info': {
            'Total': '#e31837',
            'Offshore': '#3e95cd',
            'Onsite': '#00e673',
            'CW ID': '#ffa500',
            'ADID': '#800080',
            'RSA': '#00ced1',
            'CitrixLaptop': '#ff69b4'
        },
        'Tech Mahindra Info': {
            'Exp': '#d62728'
        },
        'Tech Mahindra Details': {
            'Emp ID': '#bcbd22'
        },
        'Issues': {
            'Team': '#d62728',
            'Priority': '#9467bd',
            'Status': '#8c564b',
        }
    };

    const xAxisLabels = {
        'UPS Client Info': 'Key IDs',
        'Tech Mahindra Info': 'Last Name',
        'Tech Mahindra Details': 'Emp ID',
        'Issues': 'Resource Name'
    };

    const renderChart = (type, selectedVariables, containerId, sheet) => {
        const labels = chartData[sheet].map(item => item[xAxisLabels[sheet]]);
        const datasets = selectedVariables.map(variable => ({
            label: variable,
            data: chartData[sheet].map(item => item[variable]),
            backgroundColor: variableColors[sheet][variable],
            borderColor: variableColors[sheet][variable],
            borderWidth: 1,
        }));

        const chartConfig = {
            type: type,
            data: { labels: labels, datasets: datasets },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: sheet
                    },
                    padding: 4,
                },
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
                    selectedVariables: chart.config.data.datasets.map(dataset => dataset.label),
                    sheet: chart.config.options.plugins.title.text
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
                    renderChart(config.type, config.selectedVariables, containerId, config.sheet);
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
                containerId: containerId,
                sheet: chart.config.options.plugins.title.text 
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
                const promises = chartConfigs.map(config => {
                    const { type, selectedVariables, containerId, sheet } = config;
                    const dashboard = document.getElementById('dashboard');
                    let chartContainer = document.getElementById(containerId);

                    if (!chartContainer) {
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

                    return fetchData(sheet).then(() => {
                        renderChart(type, selectedVariables, containerId, sheet);
                    });
                });

                Promise.all(promises).catch(error => {
                    console.error('Error loading charts:', error);
                    alert('Error loading charts.');
                });
            })
            .catch(error => {
                console.error('Error loading charts:', error);
                alert('Error loading charts.');
            });
    };

    document.getElementById('loadButton').addEventListener('click', loadCharts);

    // Fetches the appropriate column names from the given sheet
    const fetchData = (sheet) => {
        const sheetMap = {
            'UPS Client Info': 'data1.json',
            'Tech Mahindra Info': 'data2.json',
            'Tech Mahindra Details': 'data3.json',
            'Issues': 'data4.json'
        };

        return fetch(`/static/${sheetMap[sheet]}`)
            .then(response => response.json())
            .then(data => {
                chartData[sheet] = data;
                updateVariableSelect(sheet);
            })
            .catch(error => {
                console.error(`Error fetching data for ${sheet}:`, error);
                return Promise.reject(error); 
            });
    };

    // This function loads the columns for the selected sheet from the sheets dropdown
    // Column names are dynamically loaded from variable colors
    const updateVariableSelect = (sheet) => {
        const variableSelect = document.getElementById('dropdown-content');
        variableSelect.innerHTML = '';

        const variables = Object.keys(variableColors[sheet] || {});
        variables.forEach(variable => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" name="dataVariable" value="${variable}"> ${variable}`;
            variableSelect.appendChild(label);
        });
    };

    // Takes input from select sheets dropdown 
    document.getElementById('sheetSelect').addEventListener('change', (event) => {
        const selectedSheet = event.target.value;
        fetchData(selectedSheet);
    });

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
        const sheet = document.getElementById('sheetSelect').value;

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
        fetchData(sheet).then(() => {
            renderChart(chartType, selectedVariables, chartId, sheet);
        });
    });

    fetchData('UPS Client Info');
});