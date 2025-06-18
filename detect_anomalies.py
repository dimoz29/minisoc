from pyod.models.iforest import IForest

def detect_anomalies(df):
    features = df[["login_failures", "port_scans", "cpu_load"]]
    model = IForest()
    model.fit(features)
    df["anomaly"] = model.predict(features)
    return df
