from flask import Flask, render_template, jsonify
from flask import request
from app_backend import generate_recipe

app = Flask(__name__)

@app.route('/')
def main():
    return render_template('main.html', ingredient_str = 'Ingredients will go here', instructions_str = "Instructions will go here")


@app.route('/query', methods=['GET', 'POST'])
def query_model():
    print(request.json)
    to_return = generate_recipe(**request.json)
    return jsonify(to_return)
    # print(to_return)
    # return jsonify({'ingredients' : '1. Gregs cat\n2. Gregs mat\n3. Gregs bat', 'instructions' : '1. Put the mat in the hat in the bat\n2. put the bat on the cat in your flat'})