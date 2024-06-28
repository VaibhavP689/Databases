import pandas as pd
from sqlalchemy import create_engine
import os
import sqlite3
import json

def method1():
    df = pd.read_excel("Project_1.xlsx", sheet_name = "Sheet3", index_col = 0)
    if(os.path.exists('mydb3.db')):
        os.remove('mydb3.db')
    engine = create_engine('sqlite:///mydb3.db')
    # Write records stored in a DataFrame to a SQL database
    df.to_sql("Sheet3Table", con = engine)
    
    # Connect to the SQLite database
    conn = sqlite3.connect('mydb3.db')
    cursor = conn.cursor()

    # Execute a query to fetch data
    cursor.execute('SELECT * FROM Sheet3Table')
    rows = cursor.fetchall()

    # Get column names from the cursor
    column_names = [description[0] for description in cursor.description]

    # Convert rows to a list of dictionaries
    data = [dict(zip(column_names, row)) for row in rows]

    # Close the connection
    conn.close()

    # Define the path to the 'data.json' file in the 'static' directory
    json_file_path = os.path.join('static', 'data3.json')

    # Create the 'static' directory if it doesn't exist
    os.makedirs('static', exist_ok=True)

    # Save the data to a JSON file
    with open(json_file_path, 'w') as json_file:
        json.dump(data, json_file, indent=4)

    print(f"Data has been saved to {json_file_path}")
