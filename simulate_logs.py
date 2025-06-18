import pandas as pd
import random
import datetime

def generate_log_data(n=100):
    timestamps = [datetime.datetime.now() - datetime.timedelta(minutes=i) for i in range(n)]
    levels = ['INFO', 'WARNING', 'ERROR']
    messages = ['User login', 'File not found', 'Disk usage high', 'Network latency detected', 'Service restarted']

    data = {
        'timestamp': timestamps,
        'level': [random.choice(levels) for _ in range(n)],
        'message': [random.choice(messages) for _ in range(n)],
        'value': [random.uniform(0, 100) for _ in range(n)]
    }

    return pd.DataFrame(data)
