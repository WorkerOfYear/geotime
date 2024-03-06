from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from src.config.config import DbConfig

login = DbConfig.db_login
passw = DbConfig.db_password
host = DbConfig.db_host
port = DbConfig.db_port
db = DbConfig.db_name

engine = create_engine(f"postgresql://{login}:{passw}@{host}:{port}/{db}")
Session = sessionmaker(bind=engine)
session = Session()

Base = declarative_base()
