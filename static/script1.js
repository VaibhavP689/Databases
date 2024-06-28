document.addEventListener('DOMContentLoaded', function() {
  const gridOptions = {
      columnDefs: [],
      rowData: [],
      defaultColDef: {
          sortable: true,
          filter: true,
      },
  };

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

  // Initialize the grid
  new agGrid.Grid(document.getElementById('myGrid'), gridOptions);
});