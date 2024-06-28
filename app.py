from flask import Flask, render_template
import sheet1
import sheet2
import sheet3
import sheet4

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True, port = 8000)