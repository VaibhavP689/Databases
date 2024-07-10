from flask import Flask, render_template, request
from flask_cors import CORS
import json
import os
import utility

app = Flask(__name__)
cors = CORS(app)

@app.route('/')
def screen1():
    return render_template('index.html')

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
    utility.createDatabaseTableFromJSON(final, "mydb1.db", 'Sheet1')
    return final

@app.route("/receiver2", methods=["POST"])
def postME2():
    data = request.get_json()
    final = json.dumps(data, indent=2)
    utility.createDatabaseTableFromJSON(final, "mydb2.db", 'Sheet2')
    return final

@app.route("/receiver3", methods=["POST"])
def postME3():
    data = request.get_json()
    final = json.dumps(data, indent=2)
    utility.createDatabaseTableFromJSON(final, "mydb3.db", "Sheet3")
    return final

@app.route("/receiver4", methods=["POST"])
def postME4():
    data = request.get_json()
    final = json.dumps(data, indent=2)
    utility.createDatabaseTableFromJSON(final, "mydb4.db", "Sheet4")
    return final

def routeAction(selectedTab):
    if (selectedTab == 1):   
        if os.path.exists("mydb1.db") == False:
            utility.createDatabase("mydb1.db")
            utility.createTable("Project_1.xlsx", "Sheet1", "mydb1.db")
        utility.createJSONFileFromDB("Sheet1", "data1.json", "mydb1.db")
    elif (selectedTab == 2):   
        if os.path.exists("mydb2.db") == False:
            utility.createDatabase("mydb2.db")
            utility.createTable("Project_1.xlsx", "Sheet2", "mydb2.db")
        utility.createJSONFileFromDB("Sheet2", "data2.json", "mydb2.db")
    elif(selectedTab == 3):
        if os.path.exists("mydb3.db") == False:
            utility.createDatabase("mydb3.db")
            utility.createTable("Project_1.xlsx", "Sheet3", "mydb3.db")
        utility.createJSONFileFromDB("Sheet3", "data3.json", "mydb3.db")
    elif(selectedTab == 4):
        if os.path.exists("mydb4.db") == False:
            utility.createDatabase("mydb4.db")
            utility.createTable("Project_1.xlsx", "Sheet4", "mydb4.db")
        utility.createJSONFileFromDB("Sheet4", "data4.json", "mydb4.db")

if __name__ == '__main__':
    app.run(debug=True, port = 8000)