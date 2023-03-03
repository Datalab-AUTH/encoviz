from pydantic import BaseModel, validator
from typing import Tuple
from datetime import datetime
import json


devices = json.load(open('devices.json'))
users = json.load(open('users.json'))


class UserInsert(BaseModel):
    user: str
    datetime: str | datetime
    device: str | Tuple[str, str]

    @validator('user')
    def user_match(cls, user):
        if user in users['id']:
            return user
        raise ValueError(f"The user {user} does not exist")

    @validator('datetime')
    def parse_date(cls, date):
        if type(date) == str:
            return datetime.strptime(date, "%Y-%m-%d")

    @validator('device')
    def device_match(cls, device_id):
        for device in devices:
            if device_id in devices[device]:
                return device, device_id
        raise ValueError(f'The device {device_id} is not register')


class AdminInsert(BaseModel):
    datetime: str | datetime
    device: str | Tuple[str, dict]

    @validator('datetime')
    def parse_date(cls, date):
        if type(date) == str:
            return datetime.strptime(date, "%Y-%m-%d")

    @validator('device')
    def device_match(cls, device_name):
        if device_name in devices:
            return device_name, devices[device_name]
        raise ValueError(f'The device {device_name} is not register')
