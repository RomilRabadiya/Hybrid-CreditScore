// MlDecisionResult Component
// Responsibility : Display the full MlResponse from the credit decision engine
// { PD, Anomaly, RiskLabel, HybridScore, RL_Recommendation }

function MlDecisionResult({ result }) {
    if (!result) return null;

    const riskColor = {
        LOW: "#22c55e",
        MEDIUM: "#f59e0b",
        HIGH: "#ef4444"
    };

    const actionColor = {
        APPROVE_HIGH: "#16a34a",
        APPROVE_MEDIUM: "#65a30d",
        APPROVE_LOW: "#ca8a04",
        REJECT: "#dc2626"
    };

    const cardStyle = {
        border: "1px solid #e5e5e5",
        borderRadius: "8px",
        padding: "16px 20px",
        marginBottom: "16px",
        backgroundColor: "#fafafa"
    };

    const factorStyle = {
        fontSize: "13px",
        color: "#555",
        marginLeft: "16px",
        marginTop: "4px"
    };

    return (
        <div style={{ marginTop: "30px" }}>
            <h3>🤖 Credit Decision Result</h3>

            {/* 1. PD : Probability of Default */}
            <div style={cardStyle}>
                <h4 style={{ margin: "0 0 8px" }}>📉 Probability of Default (PD)</h4>
                <p style={{ margin: 0 }}>
                    <strong>{(result.PD?.Probability_of_Default * 100).toFixed(2)}%</strong> chance of default
                </p>
                <ul style={factorStyle}>
                    {result.PD?.top_factors?.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
            </div>

            {/* 2. Anomaly */}
            <div style={cardStyle}>
                <h4 style={{ margin: "0 0 8px" }}>🔍 Anomaly Detection</h4>
                <p style={{ margin: 0 }}>
                    Score: <strong>{result.Anomaly?.Anomaly_Score?.toFixed(4)}</strong> &nbsp;|&nbsp;
                    Flag: <strong style={{ color: result.Anomaly?.Anomaly_Flag === 1 ? "red" : "green" }}>
                        {result.Anomaly?.Anomaly_Flag === 1 ? "⚠️ ANOMALY DETECTED" : "✅ NORMAL"}
                    </strong>
                </p>
                <ul style={factorStyle}>
                    {result.Anomaly?.top_factors?.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
            </div>

            {/* 3. Risk Label */}
            <div style={cardStyle}>
                <h4 style={{ margin: "0 0 8px" }}>🏷️ Risk Label</h4>
                <p style={{ margin: 0 }}>
                    <strong style={{
                        color: riskColor[result.RiskLabel?.Risk_Label] || "#213547",
                        fontSize: "18px"
                    }}>
                        {result.RiskLabel?.Risk_Label}
                    </strong>
                </p>
                <ul style={factorStyle}>
                    {result.RiskLabel?.Drivers?.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
            </div>

            {/* 4. Hybrid Score */}
            <div style={cardStyle}>
                <h4 style={{ margin: "0 0 8px" }}>📊 Hybrid Credit Score</h4>
                <p style={{ margin: 0, fontSize: "22px", fontWeight: "bold" }}>
                    {result.HybridScore?.Hybrid_Score?.toFixed(1)}
                    <span style={{ fontSize: "14px", color: "#777", marginLeft: "8px" }}> / 900</span>
                </p>
                <ul style={factorStyle}>
                    {result.HybridScore?.factors?.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
            </div>

            {/* 5. RL Recommendation */}
            <div style={cardStyle}>
                <h4 style={{ margin: "0 0 8px" }}>🎯 RL Recommendation</h4>
                <p style={{
                    margin: 0, fontSize: "18px", fontWeight: "bold",
                    color: actionColor[result.RL_Recommendation?.Recommendation] || "#213547"
                }}>
                    {result.RL_Recommendation?.Recommendation}
                </p>
                <ul style={factorStyle}>
                    {result.RL_Recommendation?.Rationales?.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
            </div>
        </div>
    );
}

export default MlDecisionResult;
