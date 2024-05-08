from clients.wits_manager import WitsClient
from clients.redis_manager import RedisManager

if __name__ == '__main__':
    data = {
        'data': {
            'host': '94.41.125.130',
            'port': '12002',
            'depth': '0108',
            'well_diam': '0844',
            'lag_depth': '1108'
        }
    }
    wits_client = WitsClient()
    RedisManager().add_data('wits', 'add', data)
    wits = wits_client.get_data('stream')
