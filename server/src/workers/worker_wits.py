from clients.wits_manager import WitsClient

if __name__ == '__main__':
    wits_client = WitsClient()
    wits = wits_client.get_data('stream')
