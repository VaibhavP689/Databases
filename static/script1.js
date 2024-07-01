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
    new agGrid.Grid(gridDiv, gridOptions);

    // Fetch the JSON file
    fetch('static/data1.json')
        .then(response => response.json())
        .then(data => {
            // Set column definitions from the keys of the first object
            const columns = Object.keys(data[0]).map(key => ({
                headerName: key,
                field: key,
            }));
            gridOptions.api.setColumnDefs(columns);
            gridOptions.api.setRowData(data);
        })
        .catch(error => console.error('Error loading JSON:', error));

    // Add event listener for search box
    document.getElementById('myInput').addEventListener('input', function() {
        gridOptions.api.setQuickFilter(this.value);
    });
});
