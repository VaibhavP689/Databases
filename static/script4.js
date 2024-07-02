document.addEventListener('DOMContentLoaded', function() {
    const gridOptions = {
        columnDefs: [],
        rowData: [],
        defaultColDef: {
            sortable: true,
            filter: true,
        },
    };

    // Initialize the grid
    const gridDiv = document.getElementById('myGrid');
    const gridApi = new agGrid.createGrid(gridDiv, gridOptions);

    // Fetch the JSON file
    fetch('static/data4.json')
        .then(response => response.json())
        .then(data => {
            // Set column definitions from the keys of the first object
            const columns = Object.keys(data[0]).map(key => ({
                headerName: key,
                field: key,
            }));
            gridApi.setGridOption('columnDefs', columns);
            gridApi.setGridOption('rowData', data);
        })
        .catch(error => console.error('Error loading JSON:', error));

    // Add event listener for search box
    document.getElementById('myInput').addEventListener('input', function() {
        gridApi.setGridOption('quickFilterText', this.value);
    });
});
