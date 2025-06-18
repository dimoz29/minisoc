import pandas as pd
import random
import datetime

def generate_log_data(num_logs=100):
    logs = []
    now = datetime.datetime.now()
    for _ in range(num_logs):
        timestamp = now.strftime("%Y-%m-%d %H:%M:%S")
        level = random.choice(["INFO", "DEBUG", "WARN", "ERROR"])
        message = random.choice([
            "User login successful",
            "File not found",
            "Connection reset",
            "Disk almost full",
            "Service started",
            "Unexpected shutdown"
        ])
        logs.append({"timestamp": timestamp, "level": level, "message": message})
        now += datetime.timedelta(seconds=random.randint(1, 10))
    return pd.DataFrame(logs)
