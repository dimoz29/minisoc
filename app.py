import streamlit as st
from simulate_logs import generate_log_data
from detect_anomalies import detect_anomalies
import pandas as pd

st.set_page_config(page_title="Mini SOC - AI Demo", layout="wide")

st.markdown(
    """
    <style>
    body {
        background: linear-gradient(to right, #e0f7fa, #e1bee7);
    }
    .big-title {
        font-size: 3rem;
        font-weight: bold;
        text-align: center;
        color: #4a148c;
    }
    .subtitle {
        font-size: 1.25rem;
        text-align: center;
        color: #6a1b9a;
        margin-bottom: 2rem;
    }
    .stButton>button {
        background-color: #7b1fa2;
        color: white;
        border-radius: 5px;
        font-size: 1rem;
        padding: 0.75rem 2rem;
    }
    .stButton>button:hover {
        background-color: #9c27b0;
    }
    .card {
        background-color: white;
        border-radius: 1rem;
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        margin-top: 2rem;
    }
    </style>
    """, unsafe_allow_html=True
)

st.markdown("<div class='big-title'>🔍 Mini SOC - AI Log Anomaly Detection</div>", unsafe_allow_html=True)
st.markdown("<div class='subtitle'>Simulate logs, analyze anomalies with AI, and visualize suspicious entries</div>", unsafe_allow_html=True)

if st.button("Show Demo"):
    with st.spinner("Generating logs and detecting anomalies..."):
        df = generate_log_data()
        result = detect_anomalies(df)

        def highlight_anomalies(row):
            return ['background-color: #ffdddd' if row['anomaly'] == 1 else '' for _ in row]

        styled_df = result.style.apply(highlight_anomalies, axis=1)

        st.markdown("<div class='card'>", unsafe_allow_html=True)
        st.subheader("📊 Detection Results")
        st.dataframe(styled_df)
        st.markdown("</div>", unsafe_allow_html=True)

        st.success("Detection complete. Red rows indicate anomalies.")
