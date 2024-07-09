from flask import Flask, render_template, request
from flask_cors import CORS
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
import json
import os
import sheet1
import sheet2
import sheet3
import sheet4

app = Flask(__name__)
cors = CORS(app)

@app.route('/')
def screen1():
    return render_template('index.html')

@app.route('/upsclientinfo')
def screen2():
    sheet1.method1()
    return render_template('sheet1.html')

@app.route('/techmahindrainfo')
def screen3():
    sheet2.method1()
    return render_template('sheet2.html')

@app.route('/techmahindraemployeedetails')
def screen4():
    sheet3.method1()
    return render_template('sheet3.html')

@app.route('/issues')
def screen5():
    sheet4.method1()
    return render_template('sheet4.html')

@app.route("/receiver1", methods=["POST"])
def postME1():
    data = request.get_json()
    final = json.dumps(data, indent=2)
    # json_file_path = os.path.join('static', 'data1.json')
    # with open(json_file_path, 'w') as outfile:
    #     dict_train = json.dump(data, outfile, indent=4)
    sheet1.createDatabaseTableFromJSON(final)
    return final

@app.route("/receiver2", methods=["POST"])
def postME2():
    data = request.get_json()
    print(data)
    json_file_path = os.path.join('static', 'data2.json')
    with open(json_file_path, 'w') as outfile:
        dict_train = json.dump(data, outfile, indent=4)

    # engine = create_engine('sqlite:///mydb1.db')
    # conn: Engine.connect = engine.connect()

    # train = pd.DataFrame.from_dict(dict_train, orient='index')
    # train.to_sql("Sheet1Table", con=engine, if_exists='replace', index=False)

    # conn.close()
    # engine.dispose()
    return data

@app.route("/receiver3", methods=["POST"])
def postME3():
    data = request.get_json()
    print(data)
    json_file_path = os.path.join('static', 'data3.json')
    with open(json_file_path, 'w') as outfile:
        dict_train = json.dump(data, outfile, indent=4)

    # engine = create_engine('sqlite:///mydb1.db')
    # conn: Engine.connect = engine.connect()

    # train = pd.DataFrame.from_dict(dict_train, orient='index')
    # train.to_sql("Sheet1Table", con=engine, if_exists='replace', index=False)

    # conn.close()
    # engine.dispose()
    return data

@app.route("/receiver4", methods=["POST"])
def postME4():
    data = request.get_json()
    print(data)
    json_file_path = os.path.join('static', 'data4.json')
    with open(json_file_path, 'w') as outfile:
        dict_train = json.dump(data, outfile, indent=4)

    # engine = create_engine('sqlite:///mydb1.db')
    # conn: Engine.connect = engine.connect()

    # train = pd.DataFrame.from_dict(dict_train, orient='index')
    # train.to_sql("Sheet1Table", con=engine, if_exists='replace', index=False)

    # conn.close()
    # engine.dispose()
    return data

if __name__ == '__main__':
    app.run(debug=True, port = 8000)