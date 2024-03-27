import os

from dotenv import load_dotenv

load_dotenv()


class DbConfig:
    db_host = os.environ["DB_HOST"]
    #db_host = "localhost"
    db_port = os.environ["DB_PORT"]
    db_password = os.environ["DB_PASSWORD"]
    db_login = os.environ["DB_LOGIN"]
    db_name = os.environ["DB_NAME"]


class RedisConfig:
    host = os.environ["REDIS_HOST"]
    #host = "localhost"
    port = os.environ["REDIS_PORT"]


class RabbitConfig:
    # host = os.environ["RABBIT_HOST"]
    host ="localhost"
