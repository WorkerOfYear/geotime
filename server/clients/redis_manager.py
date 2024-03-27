import redis
import uuid
import json

from src.config.config import RedisConfig


class RedisManager:
    def __init__(self) -> None:
        self.client = redis.Redis(host=RedisConfig.host,
                                  port=RedisConfig.port,
                                  db=0)

    def set_info(self, camera_id, data):
        self.client.set(camera_id, json.dumps(data))
        self.client.persist(camera_id)

    def add_data(self, type_entity: str, type_operation: str, data: dict) -> str:
        if type_entity == 'camera':
            if type_operation == 'add':
                camera_id = str(uuid.uuid4())
                self.set_info(camera_id, data)
                return camera_id

            if type_operation == 'update':
                camera_id = data['id']
                del data['id']
                self.set_info(camera_id, data)

        if type_entity == 'wits':
            self.set_info('wits', data)
            self.client.persist('wits')
            return 'wits'

        if type_entity == 'job':
            self.set_info(data['id'], data)
            self.client.persist(data['id'])

        if type_entity == 'camers':
            self.set_info(data['camera_id'], data)
            self.client.persist(data['camera_id'])

        if type_entity == 'calib':
            self.set_info(data['calibration_id'], data)
            self.client.persist(data['calibration_id'])

    def get_data(self, slot_id: str) -> dict | None:
        value = self.client.get(slot_id)
        if value is None:
            return None
        return json.loads(value.decode("utf-8"))
