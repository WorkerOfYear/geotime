import time


def test_process_stream(stream_url):
    # Здесь инициализируются данные в эндпоинте
    yield
    while True:
        # Здесь обработку будут выполнять воркеры
        time.sleep(1)
        yield {
            "total_shlam_square": 13,
            "total_shlam_volume": 32,
            "average_speed": 43,
        }
