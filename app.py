from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import json
import os
import sqlite3
import utility

app = Flask(__name__)
cors = CORS(app)

@app.route('/')
def screen1():
    utility.createSheetMetaData("Project_1.xlsx")
    return render_template('index.html')

# @app.route('/chart-data')
# def chart_data():
#     try:
#         with open('static/data1.json', 'r') as f:
#             data = json.load(f)
#             # Extracting required data for the chart (first and fifth variables)
#             labels = [item['Key IDs'] for item in data]
#             values = [item['Total'] for item in data]
#             offshoreValues = [item['Offshore'] for item in data]
#             return jsonify({
#                 'labels': labels,
#                 'values': values,
#                 'offshoreValues': offshoreValues
#             })
#     except Exception as e:
#         print(f"Error loading data from JSON file: {str(e)}")
#         return jsonify({
#             'error': 'Failed to load data'
#         })

@app.route('/save-charts', methods=['POST'])
def save_charts():
    try:
        data = request.get_json()
        with open('static/data0.json', 'w') as f:
            json.dump(data, f, indent=2)
        return jsonify({'message': 'Charts saved successfully'})
    except Exception as e:
        print(f"Error saving charts data to JSON file: {str(e)}")
        return jsonify({'error': 'Failed to save data'}), 500
    
@app.route('/load-charts')
def load_charts():
    try:
        with open('static/data0.json', 'r') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        print(f"Error loading charts data from JSON file: {str(e)}")
        return jsonify({'error': 'Failed to load data'}), 500

@app.route('/upsclientinfo')
def screen2():
    routeAction(1)
    return render_template('sheet1.html')

@app.route('/techmahindrainfo')
def screen3():
    routeAction(2)
    return render_template('sheet2.html')

@app.route('/techmahindraemployeedetails')
def screen4():
    routeAction(3)
    return render_template('sheet3.html')

@app.route('/issues')
def screen5():
    routeAction(4)
    return render_template('sheet4.html')

@app.route("/receiver1", methods=["POST"])
def postME1():
    data = request.get_json()
    final = json.dumps(data, indent=2)
    utility.createDatabaseTableFromJSON(final, "mydb.db", 'Sheet1')
    return final

@app.route("/receiver2", methods=["POST"])
def postME2():
    data = request.get_json()
    final = json.dumps(data, indent=2)
    utility.createDatabaseTableFromJSON(final, "mydb.db", 'Sheet2')
    return final

@app.route("/receiver3", methods=["POST"])
def postME3():
    data = request.get_json()
    final = json.dumps(data, indent=2)
    utility.createDatabaseTableFromJSON(final, "mydb.db", "Sheet3")
    utility.createJSONFileFromDB("Sheet3", "data3.json", "mydb.db")
    return final

@app.route("/receiver4", methods=["POST"])
def postME4():
    data = request.get_json()
    final = json.dumps(data, indent=2)
    utility.createDatabaseTableFromJSON(final, "mydb.db", "Sheet4")
    return final

def routeAction(selectedTab):
    if os.path.exists("mydb.db") == False:
        utility.createDatabase("mydb.db")
    conn = sqlite3.connect('mydb.db')
    cursor = conn.cursor()

    if (selectedTab == 1):   
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Sheet1Table'")
        result = cursor.fetchone()
        if result is None:
            utility.createTable("Project_1.xlsx", "Sheet1", "mydb.db")
        utility.createJSONFileFromDB("Sheet1", "data1.json", "mydb.db")
    elif (selectedTab == 2):   
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Sheet2Table'")
        result = cursor.fetchone()
        if result is None:
            utility.createTable("Project_1.xlsx", "Sheet2", "mydb.db")
        utility.createJSONFileFromDB("Sheet2", "data2.json", "mydb.db")
    elif(selectedTab == 3):
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Sheet3Table'")
        result = cursor.fetchone()
        if result is None:
            utility.createTable("Project_1.xlsx", "Sheet3", "mydb.db")
        utility.createJSONFileFromDB("Sheet3", "data3.json", "mydb.db")
    elif(selectedTab == 4):
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='Sheet4Table'")
        result = cursor.fetchone()
        if result is None:
            utility.createTable("Project_1.xlsx", "Sheet4", "mydb.db")
        utility.createJSONFileFromDB("Sheet4", "data4.json", "mydb.db")

if __name__ == '__main__':
    app.run(debug=True, port = 8000)