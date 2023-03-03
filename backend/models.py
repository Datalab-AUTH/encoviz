from mongoengine import Document, StringField, DateField, ListField, LongField


class User(Document):
    user_id = StringField()
    device = StringField()
    device_id = StringField()
    datetime = DateField()
    device_consumption = ListField()
    hour_data = ListField()


class Admin(Document):
    total_users = LongField()
    device = StringField()
    datetime = DateField()
    hour_data = ListField()


class Hardware(Document):
    user_id = StringField()
    device = StringField()
    device_id = StringField()
    filename = StringField()
