document.addEventListener('DOMContentLoaded', function() {
    
    const gridOptions = {
        columnDefs: [],
        rowData: [],
        defaultColDef: {
            sortable: true,
            filter: true,
            editable: true,
        }
    };

    // Initialize the grid
    const gridDiv = document.getElementById('myGrid');
    const gridApi = new agGrid.createGrid(gridDiv, gridOptions);

    // Fetch the JSON file
    fetch('static/data2.json')
        .then(response => response.json())
        .then(data => {
            // Set column definitions from the keys of the first object
            const columns = Object.keys(data[0]).map(key => ({
                headerName: key,
                field: key,
            }));
            gridApi.setGridOption('columnDefs', columns);
            gridApi.setGridOption('editType', 'fullRow');
            gridApi.setGridOption('rowData', data);
        })
        .catch(error => console.error('Error loading JSON:', error));
        
    // Add event listener for search box
    document.getElementById('myInput').addEventListener('input', function() {
        gridApi.setGridOption('quickFilterText', this.value);
    });

    // Add event listener for add row button
    document.getElementById('addRowBtn').addEventListener('click', function() {
        gridApi.applyTransaction({ add: [{}] });
    });

    // Add event listener to the button
    document.getElementById('exportButton').addEventListener('click', () => {
        exportGridDataToJson(gridApi);
        setTimeout(() => {
            this.location.reload();
            console.log('Timeout completed!');
          }, 200);

    });
});

function exportGridDataToJson(gridApi) {
    const rowData = [];
    gridApi.forEachNode(node => rowData.push(node.data));

    const json = JSON.stringify(rowData, null, 2);

    fetch("/receiver2", 
        {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
        body:json})
        .then(function(response){
                if(response.ok){
                    console.log("hello")
                }else{
                    alert("something is wrong")
                }
            }).catch((err) => console.error(err));
            
           

    // const blob = new Blob([json], { type: "application/json" });

    // const url = URL.createObjectURL(blob);
    // const a = document.createElement('a');
    // a.href = url;
    // a.download = 'gridData.json';
    
    // a.click();

    // URL.revokeObjectURL(url);

    }