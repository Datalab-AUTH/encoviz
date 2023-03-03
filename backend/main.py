from fastapi import FastAPI, Header
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from modules import insert_data, search_user, search_devices, get_statistics
from redis import Redis
from rq import Queue
import os
import requests

# Constants
load_dotenv()
app = FastAPI()
queue = Queue(name='insert', connection=Redis(
    host=os.getenv('REDIS_URL'),
    port=int(os.getenv('REDIS_PORT'))
))


origins = [
    "http://localhost:4200",
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def verified(access_token):
    keycloak_status_code = requests.get(
        'http://greendashboard.identity:8080/admin/realms/GreenDash/protocol/openid-connect/userinfo',
        headers={
            'Authorization': f'Bearer {access_token}'
        }
        ).status_code
    if keycloak_status_code == 200:
        return True
    else:
        return False

@app.get("/")
async def root(access_token: str = Header(default=None)):
    # if not verified(access_token):
    #     return {"error": "HTTP 401 Unauthorized"}
    return {"message": "Hello to Heart API"}


@app.post("/insert")
async def insert(folder: str, access_token: str = Header(default=None)):
    # if not verified(access_token):
    #     return {"error": "HTTP 401 Unauthorized"}
    queue.enqueue(insert_data, folder) # TODO: activate queue
    # insert_data(folder) # TODO: remove this line
    return {"message": f"Folder `{folder}` added to queue"}


@app.get("/users/{userId}/devices/{deviceId}/energy-consumption")
async def get_user(userId: str, deviceId: str, maxDate: str, timeUnit: str, access_token: str = Header(default=None)):
    # if not verified(access_token):
    #     return {"error": "HTTP 401 Unauthorized"}
    return await search_user(maxDate, timeUnit, userId, deviceId)


@app.get("/users/{userId}/energy-consumption")
async def get_user(userId: str, maxDate: str, timeUnit: str, access_token: str = Header(default=None)):
    # if not verified(access_token):
    #     return {"error": "HTTP 401 Unauthorized"}
    return await search_user(maxDate, timeUnit, userId)


@app.get("/users/energy-consumption")
async def get_user_total_consumption(maxDate: str, timeUnit: str, access_token: str = Header(default=None)):
    # if not verified(access_token):
    #     return {"error": "HTTP 401 Unauthorized"}
    return await search_user(maxDate, timeUnit)


@app.get("/users/avg-energy-consumption")
async def get_user_avg_consumption(maxDate: str, timeUnit: str, access_token: str = Header(default=None)):
    # if not verified(access_token):
    #     return {"error": "HTTP 401 Unauthorized"}
    return await search_user(maxDate, timeUnit, avg=True)

@app.get("/users/{userId}/devices")
async def get_user_devices(userId: str, access_token: str = Header(default=None)):
    # if not verified(access_token):
    #     return {"error": "HTTP 401 Unauthorized"}
    return await search_devices(userId)


@app.get("/devices")
async def get_all_device_categories(access_token: str = Header(default=None)):
    # if not verified(access_token):
    #     return {"error": "HTTP 401 Unauthorized"}
    return await search_devices()


@app.get("/devices/{deviceCategory}/energy-consumption")
async def get_device_consumption(deviceCategory: str, maxDate: str, timeUnit: str, access_token: str = Header(default=None)):
    # if not verified(access_token):
    #     return {"error": "HTTP 401 Unauthorized"}
    return await search_user(maxDate, timeUnit, device=deviceCategory)

@app.get("/statistics/devices/{deviceCategory}/energy-consumption")
async def get_device_consumption(deviceCategory: str, maxDate: str, timeUnit: str, access_token: str = Header(default=None)):
    # if not verified(access_token):
    #     return {"error": "HTTP 401 Unauthorized"}
    return await get_statistics(maxDate, timeUnit, device=deviceCategory)


@app.get("/statistics/users/{userId}/devices/{deviceId}/energy-consumption")
async def get_user(userId: str, deviceId: str, maxDate: str, timeUnit: str, access_token: str = Header(default=None)):
    # if not verified(access_token):
    #     return {"error": "HTTP 401 Unauthorized"}
    return await get_statistics(maxDate, timeUnit, userId, deviceId)


@app.get("/statistics/users/{userId}/energy-consumption")
async def get_user(userId: str, maxDate: str, timeUnit: str, access_token: str = Header(default=None)):
    # if not verified(access_token):
    #     return {"error": "HTTP 401 Unauthorized"}
    return await get_statistics(maxDate, timeUnit, userId)


@app.get("/statistics/users/energy-consumption")
async def get_user_statistics_total_consumption(maxDate: str, timeUnit: str, access_token: str = Header(default=None)):
    # if not verified(access_token):
    #     return {"error": "HTTP 401 Unauthorized"}
    return await get_statistics(maxDate, timeUnit)


@app.get("/statistics/users/avg-energy-consumption")
async def get_user_avg_consumption(maxDate: str, timeUnit: str, access_token: str = Header(default=None)):
    # if not verified(access_token):
    #     return {"error": "HTTP 401 Unauthorized"}
    return await get_statistics(maxDate, timeUnit, avg=True)

