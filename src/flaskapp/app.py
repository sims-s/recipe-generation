from flask import Flask, render_template
import os

app = Flask(__name__)

@app.route('/')
def main():
    return render_template('main.html', ingredient_str = 'Ingredients will go here', instructions_str = "Instructions will go here")


@app.route('/test', methods=['GET', 'POST'])
def test():
    print('Call thes test fiunctuon!!')
    return render_template('main.html', ingredient_str = 'Test test test', instructions_str = "Test test test")

# @app.route('/<query>')
# def query_model(query):
#     print('Query: ', query)
#     return render_template('main.html')