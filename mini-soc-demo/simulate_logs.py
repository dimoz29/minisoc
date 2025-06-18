import pandas as pd
import numpy as np

def generate_log_data(n=200):
    np.random.seed(42)
    normal_data = np.random.normal(loc=0, scale=1, size=(n, 3))
    anomaly_data = np.random.normal(loc=6, scale=0.5, size=(10, 3))
    data = np.vstack([normal_data, anomaly_data])
    df = pd.DataFrame(data, columns=["login_failures", "port_scans", "cpu_load"])
    df["timestamp"] = pd.date_range(end=pd.Timestamp.now(), periods=len(df))
    return df.sample(frac=1).reset_index(drop=True)