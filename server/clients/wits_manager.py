import json
from telnetlib import Telnet

from loguru import logger

from helpers.rqueue import RabbitQueue
from clients.redis_manager import RedisManager


class WitsClient:

    @staticmethod
    def get_connection():
        wits_data_connection = RedisManager().get_data('wits')['data']
        return {
            'tn': Telnet(host=wits_data_connection['host'], port=int(wits_data_connection['port']), timeout=1),
            'value_keys': {
                wits_data_connection['depth']: "depth",
                wits_data_connection['lag_depth']: "lag_depth",
                wits_data_connection['well_diam']: "well_diam",
            }
        }

    @staticmethod
    def data_processing_from_wits(row_data: str, value_keys: dict):
        rows = row_data.splitlines()
        data = {}
        for row in rows:
            if row:
                record_type = row[0:4]

                if record_type in value_keys.keys():
                    data[value_keys[record_type]] = row.replace(record_type, "")

        if data:
            return data

    def get_last_data(self, tn: Telnet, value_keys: dict):
        all_params = []
        while True:
            data = tn.read_until(b"!!").decode("utf-8")
            if len(all_params) > 3:
                break
            if data:
                wits_param = self.data_processing_from_wits(data, value_keys)
                all_params.append(wits_param)

        tn.close()

        result = {}
        for item in all_params:
            if item:
                result.update(item)

        logger.info(f"Wits data - {result}")
        return {'depth': '1182.61', 'lag_depth': '1183.71', 'well_diam': '256.6'}  # Mock data

    def get_stream(self, tn: Telnet, value_keys: dict):
        rabbit_queue = RabbitQueue()

        all_params = []
        while True:
            data = tn.read_until(b"!!").decode("utf-8")

            if len(all_params) > 3:
                result = {}
                for item in all_params:
                    if item:
                        result.update(item)
                rabbit_queue.add_message_queue("wits", "wits", json.dumps({'depth': '1182.61', 'lag_depth': '1183.71', 'well_diam': '256.6'}))  # Mock data
                logger.info(f"Wits data send queue - {result}")
                all_params = []

            if data:
                wits_param = self.data_processing_from_wits(data, value_keys)
                all_params.append(wits_param)

    def get_data(self, param_get: str):
        logger.success("Connection opened")
        settings = self.get_connection()
        if param_get == 'last':
            return self.get_last_data(settings['tn'], settings['value_keys'])

        if param_get == 'stream':
            self.get_stream(settings['tn'], settings['value_keys'])


if __name__ == '__main__':
    wits_client = WitsClient()
    wits = wits_client.get_data('last')
    print(wits)