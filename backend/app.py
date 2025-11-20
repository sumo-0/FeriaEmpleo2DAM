from flask import Flask, request, jsonify, session
from flask_cors import CORS
import json
import os

app = Flask(__name__)
app.secret_key = '1234'  
CORS(app, supports_credentials=True)

USERS_FILE = 'users.txt'

def load_users():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_users(users):
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    users = load_users()
    if username in users:
        return jsonify({'success': False, 'message': 'Usuario ya existe'})
    
    users[username] = password
    save_users(users)
    return jsonify({'success': True, 'message': 'Registro exitoso'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    users = load_users()
    if username in users and users[username] == password:
        session['logged_in'] = True
        return jsonify({'success': True, 'message': 'Login exitoso'})
    return jsonify({'success': False, 'message': 'Usuario o contraseña incorrectos'})

@app.route('/check-auth', methods=['GET'])
def check_auth():
    return jsonify({'logged_in': session.get('logged_in', False)})

if __name__ == '__main__':
    app.run(port=5000)