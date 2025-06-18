import streamlit as st
from simulate_logs import generate_log_data
from detect_anomalies import detect_anomalies

st.set_page_config(page_title="Mini SOC Demo", layout="wide")

st.title("🔍 Mini SOC - AI Log Anomaly Detection")

st.markdown("""
This demo simulates system logs, runs AI-based anomaly detection, and shows which entries are suspicious.
""")

if st.button("Generate and Analyze Logs"):
    with st.spinner("Generating logs and detecting anomalies..."):
        df = generate_log_data()
        result = detect_anomalies(df)

        st.subheader("📊 Detection Results")

        # ✅ Highlight whole row if anomaly == 1
        def highlight_row(row):
            return ['background-color: #ffdddd' if row['anomaly'] == 1 else '' for _ in row]

        st.dataframe(result.style.apply(highlight_row, axis=1))

        st.success("Detection complete. Red rows indicate anomalies.")
