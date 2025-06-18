import streamlit as st
from simulate_logs import generate_log_data
from detect_anomalies import detect_anomalies
import pandas as pd

st.set_page_config(page_title="Mini SOC - AI Log Anomaly Detection", layout="wide")

st.markdown("""
<style>
body {
    background: linear-gradient(to bottom right, #f8f9fa, #e3f2fd);
}
h1 {
    font-size: 2.8rem;
    color: #1a237e;
}
.metric-card {
    background-color: white;
    border-radius: 1rem;
    padding: 1.2rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    text-align: center;
}
.metric-title {
    font-size: 0.9rem;
    color: #555;
}
.metric-value {
    font-size: 2rem;
    font-weight: bold;
}
.metric-ok {
    color: green;
}
.metric-bad {
    color: red;
}
.badge {
    display: inline-block;
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: 0.5rem;
}
.badge-normal {
    background-color: #e8f5e9;
    color: #2e7d32;
}
.badge-anomaly {
    background-color: #ffebee;
    color: #c62828;
}
.bar-container {
    width: 100px;
    height: 10px;
    background-color: #eee;
    border-radius: 5px;
}
.bar-fill {
    height: 100%;
    border-radius: 5px;
    background: linear-gradient(to right, #42a5f5, #1e88e5);
}
</style>
""", unsafe_allow_html=True)

st.title("🔍 Mini SOC - AI Log Anomaly Detection")
st.write("This demo simulates system logs, runs AI-based anomaly detection, and shows which entries are suspicious.")

if st.button("🚀 Generate and Analyze Logs"):
    with st.spinner("Analyzing..."):
        df = generate_log_data()
        result = detect_anomalies(df)

        normal_count = (result['anomaly'] == 0).sum()
        anomaly_count = (result['anomaly'] == 1).sum()
        total = len(result)

        # METRICS
        col1, col2, col3 = st.columns(3)
        col1.markdown(f"<div class='metric-card'><div class='metric-title'>Total Logs</div><div class='metric-value'>{total}</div></div>", unsafe_allow_html=True)
        col2.markdown(f"<div class='metric-card'><div class='metric-title'>Normal Events</div><div class='metric-value metric-ok'>{normal_count}</div></div>", unsafe_allow_html=True)
        col3.markdown(f"<div class='metric-card'><div class='metric-title'>Anomalies Detected</div><div class='metric-value metric-bad'>{anomaly_count}</div></div>", unsafe_allow_html=True)

        st.markdown("### 📊 Detection Results")
        st.caption("Red-highlighted rows indicate detected anomalies.")

        def style_row(row):
            return ['background-color: #ffebee' if row['anomaly'] == 1 else '' for _ in row]

        display_df = result.copy()
        display_df['Status'] = display_df['anomaly'].apply(lambda x: "🔴 Anomaly" if x else "🛡️ Normal")
        display_df['Risk Score'] = (display_df['login_failures'] + display_df['port_scans'] + display_df['cpu_load']).abs()
        display_df['Risk Score'] = display_df['Risk Score'].apply(lambda x: f"<div class='bar-container'><div class='bar-fill' style='width:{min(100,int(x*10))}%'></div></div>",)

        display_df = display_df[['timestamp', 'login_failures', 'port_scans', 'cpu_load', 'Status', 'Risk Score']]

        st.write(display_df.to_html(escape=False, index=False), unsafe_allow_html=True)
