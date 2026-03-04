function MlDecisionResult({ result }) {
    if (!result) return null;
    // It will display the full MlResponse from the credit decision engine
    // { PD, Anomaly, RiskLabel, HybridScore, RL_Recommendation }

    // MLResponse in Card format
    return (
        <div style={{ marginTop: "30px" }}>
            <h3>Credit Decision Result</h3>

            {/* 1. PD : Probability of Default */}
            <div>
                <h4>Probability of Default (PD)</h4>
                <p>
                    <strong>{(result.PD?.Probability_of_Default * 100).toFixed(2)}%</strong> chance of default
                </p>
                <ul>
                    {result.PD?.top_factors?.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
            </div>

            {/* 2. Anomaly */}
            <div>
                <h4>Anomaly Detection</h4>
                <p>
                    Score: <strong>{result.Anomaly?.Anomaly_Score?.toFixed(4)}</strong> &nbsp;|&nbsp;
                    Flag: <strong style={{ color: result.Anomaly?.Anomaly_Flag === 1 ? "red" : "green" }}>
                        {result.Anomaly?.Anomaly_Flag === 1 ? "⚠️ ANOMALY DETECTED" : "✅ NORMAL"}
                    </strong>
                </p>
                <ul>
                    {result.Anomaly?.top_factors?.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
            </div>

            {/* 3. Risk Label */}
            <div>
                <h4>Risk Label</h4>
                <p>
                    <strong>
                        {result.RiskLabel?.Risk_Label}
                    </strong>
                </p>
                <ul>
                    {result.RiskLabel?.Drivers?.map((d, i) => <li key={i}>{d}</li>)}
                </ul>
            </div>

            {/* 4. Hybrid Score */}
            <div>
                <h4>Hybrid Credit Score</h4>
                <p>
                    {result.HybridScore?.Hybrid_Score?.toFixed(1)}
                    <span> / 900</span>
                </p>
                <ul>
                    {result.HybridScore?.factors?.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
            </div>

            {/* 5. RL Recommendation */}
            <div>
                <h4>RL Recommendation</h4>
                <p style={{
                    fontSize: "18px", fontWeight: "bold"
                }}>
                    {result.RL_Recommendation?.Recommendation}
                </p>
                <ul>
                    {result.RL_Recommendation?.Rationales?.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
            </div>
        </div>
    );
}

export default MlDecisionResult;
