document.addEventListener('DOMContentLoaded', function() {
    
    const gridOptions = {
        columnDefs: [],
        rowData: [],
        defaultColDef: {
            sortable: true,
            filter: true,
            editable: true,
        },
        rowSelection: "multiple"
    };

    // Initialize the grid
    const gridDiv = document.getElementById('myGrid');
    const gridApi = new agGrid.createGrid(gridDiv, gridOptions);
    let oldLength = 0;

    // Fetch the JSON file
    fetch('static/data1.json')
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
            oldLength = data.length;
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
    document.getElementById('deleteRowBtn').addEventListener('click', () => {
        onRemoveSelected(gridApi);
    });

    // Add event listener to the button
    document.getElementById('exportButton').addEventListener('click', () => {
        exportGridDataToJson(gridApi, oldLength);
        setTimeout(() => {
            this.location.reload();
            console.log('Timeout completed!');
          }, 200);
    });
});

function exportGridDataToJson(gridApi, oldLength) {
    const rowData = [];
    gridApi.forEachNode(node => rowData.push(node.data));
    const filteredRowData = rowData.filter(obj => !isAllValuesNull(obj));
    const newLength = filteredRowData.length;
    let diff = newLength - oldLength;
    const json = JSON.stringify(filteredRowData, null, 2);

    fetch("/receiver1", 
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

    if(diff === 1) {
        alert("UPS Client Info Data Saved With A Net 1 Row Added");
    }
    else if(diff > 0) {
        alert("UPS Client Info Data Saved With A Net " + diff + " Rows Added");
    }
    else if(diff === 0){
        alert('UPS Client Info Data Saved With A Net 0 Rows Added Or Removed');
    }
    else if(diff === -1) {
        alert("UPS Client Info Data Saved With A Net 1 Row Removed");
    }
    else {
        diff = diff * -1;
        alert("UPS Client Info Data Saved With A Net " + diff + " Rows Removed");
    }
}


function onRemoveSelected(gridApi) {
    const selectedData = gridApi.getSelectedRows();
    const emptyRows = selectedData.filter(row => Object.values(row).every(value => value === null || value === ""));

    if (emptyRows.length > 0) {
        gridApi.applyTransaction({ remove: emptyRows });
    } else {
        if(confirm("Some of your selected rows have data in them. Are you sure you want to delete the selected rows?")) {
            gridApi.applyTransaction({ remove: selectedData });
        }
    }
}

function isAllValuesNull(obj) {
    return Object.values(obj).every(value => value === null);
}