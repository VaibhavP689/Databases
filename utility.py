import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
import os
import sqlite3
import json

def createDatabase(dbName):
    # Check if the database file exists and remove it if it does
    if os.path.exists(dbName):
        return

    # Create a new database connection and engine
    connectString = "sqlite:///" + dbName
    engine = create_engine(connectString)
    conn: Engine.connect = engine.connect()
    
    # Explicitly close the SQLAlchemy engine
    conn.close()
    engine.dispose()



def createTable(srcFileName, sheetName, dbName):
    
    conn=sqlite3.connect(dbName)

    # Write records stored in a DataFrame to a SQL database
    tblName = sheetName + "Table"
    
    df = pd.read_excel(srcFileName, sheet_name=sheetName, index_col=0)

    # Write records stored in a DataFrame to a SQL database
    df.to_sql(tblName, conn, if_exists='replace')
    print("Table Created")
    # Explicitly close the SQLAlchemy engine
    conn.commit()
    conn.close()


def createJSONFileFromDB(sheetName, outputFileName, dbName):
    # Connect to the SQLite database
    conn = sqlite3.connect(dbName)
    cursor = conn.cursor()

    # Execute a query to fetch data
    tblName = sheetName + "Table"
    cursor.execute('SELECT * FROM ' + tblName)
    rows = cursor.fetchall()

    # Get column names from the cursor
    column_names = [description[0] for description in cursor.description]

    # Convert rows to a list of dictionaries
    data = [dict(zip(column_names, row)) for row in rows]

    # Close the cursor and connection
    cursor.close()
    conn.close()

    # Define the path to the 'data2.json' file in the 'static' directory
    json_file_path = os.path.join('static', outputFileName)

    # Create the 'static' directory if it doesn't exist
    os.makedirs('static', exist_ok=True)

    # Save the data to a JSON file
    with open(json_file_path, 'w') as json_file:
        json.dump(data, json_file, indent=4)

    print(f"Data has been saved to {json_file_path}")

def createDatabaseTableFromJSON(json_string, dbName, sheetName):
    
    # Parse JSON string
    data_dict = json.loads(json_string)

    # converting json dataset from dictionary to dataframe
    df = pd.DataFrame.from_dict(data_dict)

    # Connect to SQLite database (or create it)
    conn = sqlite3.connect(dbName)
    # conn.execute("DROP TABLE Sheet1Table") 

    df.to_sql(sheetName+"Table", conn, if_exists='replace', index=False)

    # Commit changes and close connection
    conn.commit()
    conn.close()

    # Write the DataFrame to the Excel file
    with pd.ExcelWriter("Project_1.xlsx", engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
        df.to_excel(writer, sheet_name=sheetName, index=False)
        print("New Excel Created")

# def updateExcel():
#     # Define the path to the 'data1.json' file in the 'static' directory
#     json_file_path = os.path.join('static', 'data1.json')

#     # Read the data from the JSON file
#     with open(json_file_path, 'r') as json_file:
#         data_dict = json.load(json_file)

#     # Convert the data to a DataFrame
#     df = pd.DataFrame(data_dict)

#     # Write the DataFrame to the Excel file
#     with pd.ExcelWriter("Project_1.xlsx", engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
#         df.to_excel(writer, sheet_name="Sheet1", index=False)

#     print("Excel file has been updated from the JSON file.")