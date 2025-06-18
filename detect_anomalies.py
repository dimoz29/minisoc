from sklearn.ensemble import IsolationForest
import pandas as pd

def detect_anomalies(df):
    df = df.copy()
    df['level_code'] = df['level'].map({"INFO": 0, "DEBUG": 1, "WARN": 2, "ERROR": 3})
    df['message_code'] = df['message'].astype('category').cat.codes
    model = IsolationForest(contamination=0.1, random_state=42)
    features = df[["level_code", "message_code"]]
    df['anomaly'] = model.fit_predict(features)
    df['anomaly'] = df['anomaly'].apply(lambda x: 1 if x == -1 else 0)
    return df
