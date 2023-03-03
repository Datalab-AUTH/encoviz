from models import User, Admin, Hardware
from pathlib import Path
from mongoengine import connect
from dotenv import load_dotenv
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import json
import os
import shutil

# Constants
load_dotenv()
connect(
    db='heart',
    host=os.getenv('MONGO_URL'),
    port=int(os.getenv('MONGO_PORT')),
    username=os.getenv('MONGO_USERNAME'),
    password=os.getenv('MONGO_PASSWORD')
)


def get_sequence_list(data):
    seqList = []
    seqList2 = []
    seq = []
    for i in data:
        if i == 0:
            seqList.append(seq)
            seq = []
        else:
            seq.append(i)
    if len(seq):
        seqList.append(seq)

    for l in seqList:
        if len(l) > 0:
            seqList2.append(l)
    return seqList2


def insert_data(folder):
    results = []
    admin_aggregation = []
    entries = Path(f'data/{folder}')
    for entry in entries.iterdir():
        if entry.suffix == '.csv':
            file = pd.read_csv(entry, delimiter=',')
            file['Timestamp'] = pd.to_datetime(file['Timestamp'], unit='s')
            file['Year'] = file['Timestamp'].dt.year
            file['Month'] = file['Timestamp'].dt.month
            file['Day'] = file['Timestamp'].dt.day
            file['Hour'] = file['Timestamp'].dt.hour
            file['Minute'] = file['Timestamp'].dt.minute
            # file = file.groupby([file['Year'], file['Month'], file['Day'], file['Hour']])['Value'].sum().to_frame()
            file = file.groupby([file['Year'], file['Month'], file['Day'], file['Hour'], file['Minute']])['Value'].sum().to_frame()
            data = dict()
            de = dict()
            for index, value in file.itertuples():
                date = str(index[0]) + '-' + \
                    str(index[1]) + '-' + str(index[2])
                if date not in data:
                    data[date] = [0 for _ in range(24)]
                    de[date] = [0 for _ in range(24)]
                    # de[date] = [0 for _ in range(1440)]
                data[date][index[3]] += value*(1/600000)
                de[date][index[3]] += value*(1/600000)
                # de[date][index[3]*60 + index[4]] = value
            # filename = entry.stem.split('_')
            filename = entry.stem
            hardware_info: Hardware = Hardware.objects.get(
                filename=filename)
            for date in data:
                results.append(User(**{
                    'user_id': hardware_info.user_id,
                    'device': hardware_info.device,
                    'device_id': hardware_info.device_id,
                    'datetime': date,
                    'device_consumption': get_sequence_list(de[date]),
                    # 'device_consumption': de[date],
                    'hour_data': data[date]
                }))
                admin_aggregation.append((date, hardware_info.device))
        if len(results):
            User.objects.insert(results, load_bulk=False)
            results.clear()
    admin_insert_data(list(set(admin_aggregation)))
    shutil.rmtree(entries) # TODO: activate this line


def admin_insert_data(data):
    for date, device in data:
        hour_data = [0 for _ in range(24)]
        total_users = 0
        for user in User.objects(datetime=date, device=device):
            hour_data = np.add(hour_data, json.loads(user.to_json())['hour_data']).tolist()
            total_users += 1
        # hour_data = np.divide(hour_data, total_users).tolist()
        Admin(**{
            'total_users': total_users,
            'device': device,
            'datetime': date,
            'hour_data': hour_data
        }).save()


async def search_user(max_date: str, unit: str, user: str = None, device: str = None, avg: bool = False):
    max_date = datetime.strptime(max_date, "%Y-%m-%d")
    if unit == 'day':
        min_date = max_date
    elif unit == 'week':
        min_date = max_date - timedelta(days=6)
    elif unit == 'month':
        min_date = max_date - timedelta(days=29)
    elif unit == 'year':
        min_date = max_date - timedelta(days=364)
    if user is None and device is None:
        if unit == 'day':
            data = json.loads(Admin.objects(device="din", datetime=max_date).to_json())
        else:
            data = json.loads(Admin.objects(device="din", datetime__gte=min_date, datetime__lte=max_date).to_json())
    elif user is None:
        if unit == 'day':
            data = json.loads(Admin.objects(device=device, datetime=max_date).to_json())
        else:
            data = json.loads(Admin.objects(device=device, datetime__gte=min_date, datetime__lte=max_date).to_json())
    elif device is None:
        if unit == 'day':
            data = json.loads(User.objects(device="din", user_id=user, datetime=max_date).to_json())
        else:
            data = json.loads(User.objects(device="din", user_id=user, datetime__gte=min_date, datetime__lte=max_date).to_json())
    else:
        if unit == 'day':
            data = json.loads(User.objects(user_id=user, device_id=device, datetime=max_date).to_json())
        else:
            data = json.loads(User.objects(user_id=user, device_id=device, datetime__gte=min_date, datetime__lte=max_date).to_json())
    if len(data) == 0:
        return {
            "data": None
        }
    res = []
    print(data[0])
    if device is None:
        if avg:
            total_users = data[0]["total_users"]
            res = [ScatterDataPoint(obj.x, obj.y / total_users) for obj in parse_unit(unit, data, max_date)]
        else:
            res = parse_unit(unit, data, max_date)
    else:
        data = map_data_to_device(data)
        for device in data:
            res = parse_unit(unit, data[device], max_date)
    return {
        "data": res,
        "maxDate": max_date.strftime("%Y-%m-%d"),
        "minDate": min_date.strftime("%Y-%m-%d")
    }


def map_data_to_device(data):
    obj = dict()
    for element in data:
        if element['device'] not in obj:
            obj[element['device']] = []
        obj[element['device']].append(element)
    return obj


class ScatterDataPoint:
    def __init__(self, x, y):
        self.x = x
        self.y = y


def parse_unit(unit, data, max_date: datetime = None):
    if unit == 'day':
        sum_per_hour = np.sum([element['hour_data'] for element in data], axis=0).tolist()
        total_units = []
        for i in range(24):
            total_units.append(ScatterDataPoint(
                max_date.timestamp() * 1000, sum_per_hour[i]))
            max_date += timedelta(hours=1)
        data = total_units
    elif unit == 'week':
        data = calculate_units(data, max_date, 7)
    elif unit == 'month':
        data = calculate_units(data, max_date, 30)
    elif unit == 'year':
        # data = calculate_units(data, max_date.replace(day=1), 12, False)
        data = calculate_units(data, max_date, 12, False)
    else:
        data = 'Invalid parameters'
    return data


def calculate_units(data, max_date: datetime, num_of_units: int, diff_in_days: bool = True):
    total_units = []
    months_key = {}
    temp_month = max_date.month
    for i in range(num_of_units):
        total_units.append(ScatterDataPoint(None, 0))
        if not diff_in_days:
            months_key[temp_month] = i
            temp_month -= 1
            if temp_month == 0:
                temp_month = 12
    for element in data:
        min_date = datetime.fromtimestamp(element['datetime']['$date'] / 1000.0)
        diff = max_date - min_date
        if diff_in_days:
            if diff.days == -1:
                index = num_of_units - 1
            else:
                index = (num_of_units - 1) - diff.days
        else:
            index = (num_of_units - 1) - months_key[min_date.month]
        total_units[index].y += sum(element['hour_data'])
        if diff_in_days:
            total_units[index].x = element['datetime']['$date']
        else:
            total_units[index].x = min_date.strftime("%Y-%m")
    return total_units


async def search_devices(user: str = None):
    if user is None:
        data = json.dumps(Hardware.objects.distinct('device'))
        return json.loads(data)
    else:
        data = json.loads(Hardware.objects(user_id=user).to_json())
        return [{"name": element['device'], "id": element['device_id']} for element in data]


async def get_statistics(max_date: str, unit: str, user: str = None, device: str = None, avg: bool = False):
    if unit == 'day':
        data = (await search_user(max_date, 'week', user, device, avg))['data']
        past_consumption = [obj.y for obj in data]
    elif unit == 'week':
        data = (await search_user(max_date, 'month', user, device, avg))['data']
        past_consumption = [obj.y for obj in data[-14:]]
        past_consumption = [sum(past_consumption[:7]), sum(past_consumption[7:])]
    elif unit == 'month':
        data = (await search_user(max_date, 'year', user, device, avg))['data']
        past_consumption = [data[-2].y, data[-1].y]
    if past_consumption[-2] != 0:
        percent = (past_consumption[-1] - past_consumption[-2]) / past_consumption[-2]
    else:
        percent = 0
    return {
        "consumption": data[-1].y,
        "pastConsumption": [{"inPx": int((float(i)/max(past_consumption))*100), "actual": i} for i in past_consumption],
        "percent": percent * 100
    }
