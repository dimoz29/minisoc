import pandas as pd
import random
import datetime

def generate_log_data(n=200):
    data = {
        "timestamp": [datetime.datetime.now() - datetime.timedelta(minutes=i*5) for i in range(n)],
        "login_failures": [random.gauss(0, 1) for _ in range(n)],
        "port_scans": [random.gauss(0, 1) for _ in range(n)],
        "cpu_load": [random.gauss(0, 1) for _ in range(n)],
    }
    return pd.DataFrame(data)
