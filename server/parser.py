import asyncio
import telnetlib
import json

HOST = "94.41.125.130"
PORT = 12002

value_keys = {
    "0108": "Depth",
    "1108": "LagDepth",
    "0844": "WellDiam",
}


def data_processing_from_wits(row_data: str):
    """
    Парсит из строки параметры и возвращает словарь
    """
    rows = row_data.splitlines()
    data = {}
    for row in rows:
        if row:
            record_type = row[0:4]

            if record_type in value_keys.keys():
                data[value_keys[record_type]] = row.replace(record_type, "")

    if data:
        print(data)


def client():
    tn = telnetlib.Telnet(host=HOST, port=PORT, timeout=2)
    print("Connection opened")

    while True:
        data = tn.read_until(b"!!").decode("utf-8")
        if data:
            data_processing_from_wits(data)

    tn.close()
    print("Connection closed")


if __name__ == "__main__":
    client()