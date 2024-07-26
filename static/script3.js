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
    fetch('static/data3.json')
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

    // Add event listener for add row button
    document.getElementById('addColumnBtn').addEventListener('click', function() {
        addColumn(gridApi);
    });

    // Add event listener to the button
    document.getElementById('deleteColumnBtn').addEventListener('click', () => {
        deleteColumn(gridApi);
    });

    // Add event listener to the button
    document.getElementById('exportButton').addEventListener('click', () => {
        const params = {
            fileName: 'EmployeeDetails.csv'
        };
        gridApi.exportDataAsCsv(params);
    });

    // Add event listener to the button
    document.getElementById('saveButton').addEventListener('click', () => {
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

    fetch("/receiver3", 
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
        alert("Tech Mahindra Employee Details Data Saved With A Net 1 Row Added");
    }
    else if(diff > 0) {
        alert("Tech Mahindra Employee Details Data Saved With A Net " + diff + " Rows Added");
    }
    else if(diff === 0){
        alert('Tech Mahindra Employee Details Data Saved With A Net 0 Rows Added Or Removed');
    }
    else if(diff === -1) {
        alert("Tech Mahindra Employee Details Data Saved With A Net 1 Row Removed");
    }
    else {
        diff = diff * -1;
        alert("Tech Mahindra Employee Details Data Saved With A Net " + diff + " Rows Removed");
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

function addColumn(gridApi) {
    const columnName = prompt("What is the new column name?");
    let isItInt = prompt("Is this string or number data? String for string, Number for number.");

    const rowData = [];
    gridApi.forEachNode(node => rowData.push(node.data));
    const filteredRowData = rowData.filter(obj => !isAllValuesNull(obj));
    console.log(filteredRowData);
    if (isItInt === "String" || isItInt === "string") {
        for (let dict of filteredRowData) {
            // Add the new column with an empty string value
            dict[columnName] = null;
        }
    }
    else if (isItInt === "Number" || isItInt === "number") {
        for (let dict of filteredRowData) {
            // Add the new column with a value of 0
            dict[columnName] = 0;
        }
    }
    else {
        alert("Invalid Data Type. Please use either String or Number.");
    }
    console.log(filteredRowData);

    alert("New Column Saved. Screen will now refresh.");

    setTimeout(() => {
        this.location.reload();
        console.log('Timeout completed!');
      }, 200);
    const json = JSON.stringify(filteredRowData, null, 2);
    console.log(json);

    fetch("/receiver3", 
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
}

function deleteColumn(gridApi) {
    const columnName = prompt("What column do you want to delete?");

    const rowData = [];
    gridApi.forEachNode(node => rowData.push(node.data));
    const filteredRowData = rowData.filter(obj => !isAllValuesNull(obj));
    for (let dict of filteredRowData) {
        if(!checkIfKeyExist(dict, columnName)) {
            alert("Entered column name doesn't exist. Please try again.");
            return;
        }
        delete(dict[columnName]);
    }

    alert("Column Deleted. Screen will now refresh.");

    setTimeout(() => {
        this.location.reload();
        console.log('Timeout completed!');
      }, 200);
    const json = JSON.stringify(filteredRowData, null, 2);
    console.log(json);

    fetch("/receiver3", 
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
}

const checkIfKeyExist = (objectName, keyName) => {
    let keyExist = Object.keys(objectName).some(key => key === keyName);
    return keyExist;
};