import pickle
import os
import requests
import json
from models import Hardware
from mongoengine import connect
from dotenv import load_dotenv


load_dotenv()
connect(
    db='heart',
    host=os.getenv('MONGO_URL'),
    port=int(os.getenv('MONGO_PORT')),
    username=os.getenv('MONGO_USERNAME'),
    password=os.getenv('MONGO_PASSWORD')
)
access_token = requests.post('http://greendashboard.identity:8080/realms/GreenDash/protocol/openid-connect/token',
    data={
        'username': "",
        'password': "",
        'grant_type': "password",
        'client_id': "admin-cli"
    },
    headers={
        'Content-Type': 'application/x-www-form-urlencoded'
    }
).json()['access_token']
keycloak_users = requests.get('http://greendashboard.identity:8080/admin/realms/GreenDash/users?briefRepresentation=true',
    headers={
        'Authorization': f'Bearer {access_token}'
    }
).json()
users = json.load(open('users.json'))

for keycloak_user in keycloak_users:
    for user_id in users:
        if users[user_id]['Username'] == keycloak_user['username']:
            users[user_id]['keycloak_id'] = keycloak_user['id']

objects = []

with (open('records', "rb")) as f:
    for data in pickle.load(f):
        objects.append(Hardware(**{
            'user_id': str(users[str(data['user_name'])]['keycloak_id']),
            'device': data['device'].lower(),
            'device_id': data['device_id'],
            'filename': str(data['filename'])
        }))

Hardware.objects.insert(objects, load_bulk=False)

