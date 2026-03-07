import "../styles/MlDecisionResult.css";

function MlDecisionResult({ result }) {
    if (!result) return null;

    const hybridScorePercent = (result.HybridScore?.Hybrid_Score / 900) * 100;
    const pdPercent = result.PD?.Probability_of_Default * 100;
    const isAnomaly = result.Anomaly?.Anomaly_Flag === 1;
    const isHighRisk = pdPercent > 20;

    return (
        <div style={{ marginTop: "60px" }}>

            {/* ── Page Header ── */}
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <h2 style={{ marginTop: "1.45rem", fontSize: "2.2rem", fontWeight: 800, color: "var(--text-main)" }}>
                    Financial Assessment Scorecard
                </h2>
            </div>

            <div className="decision-grid">

                {/* ── 1. Hybrid Score ── */}
                <div className="decision-card-inner" style={{ borderLeftColor: "var(--accent)", background: "#fffbf2" }}>
                    <div className="card-label-col">
                        <div className="card-title">
                            <span className="card-title-dot" style={{ background: "var(--accent)" }} />
                            Hybrid Score
                        </div>
                        <div className="hybrid-confidence" style={{ marginTop: "0.5rem" }}>Confidence: 98.4%</div>
                    </div>
                    <div className="card-value-col">
                        <div className="score-display">
                            {result.HybridScore?.Hybrid_Score?.toFixed(1)}
                            <span className="score-unit">pts</span>
                        </div>
                        <div className="progress-container">
                            <div
                                className="progress-fill"
                                style={{ width: `${hybridScorePercent}%`, background: "var(--accent)" }}
                            />
                        </div>
                        {result.HybridScore?.factors?.length > 0 && (
                            <ul className="factor-list">
                                {result.HybridScore.factors.map((f, i) => (
                                    <li key={i}>{f}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* ── 2. Probability of Default ── */}
                <div className="decision-card-inner" style={{ borderLeftColor: isHighRisk ? "var(--error)" : "var(--success)", background: isHighRisk ? "#fff5f5" : "#f0fdf8" }}>
                    <div className="card-label-col">
                        <div className="card-title">
                            <span className="card-title-dot" style={{ background: isHighRisk ? "var(--error)" : "var(--success)" }} />
                            Probability of Default
                        </div>
                    </div>
                    <div className="card-value-col">
                        <div className="score-display" style={{ color: isHighRisk ? "var(--error)" : "var(--success)" }}>
                            {pdPercent.toFixed(2)}<span className="score-unit">%</span>
                        </div>
                        <div className="progress-container">
                            <div
                                className="progress-fill"
                                style={{ width: `${pdPercent}%`, background: isHighRisk ? "var(--error)" : "var(--success)" }}
                            />
                        </div>
                        <ul className="factor-list">
                            {result.PD?.top_factors?.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                    </div>
                </div>

                {/* ── 3. Anomaly Detection ── */}
                <div className="decision-card-inner" style={{ borderLeftColor: isAnomaly ? "var(--error)" : "var(--success)", background: isAnomaly ? "#fff5f5" : "#f0fdf8" }}>
                    <div className="card-label-col">
                        <div className="card-title">
                            <span className="card-title-dot" style={{ background: isAnomaly ? "var(--error)" : "var(--success)" }} />
                            Anomaly Detection
                        </div>
                    </div>
                    <div className="card-value-col">
                        <div className="outcome-status" style={{ color: isAnomaly ? "var(--error)" : "var(--success)" }}>
                            {isAnomaly ? "ANOMALOUS DETECTED" : "NOMINAL STABLE"}
                        </div>
                        <div className="anomaly-score-label">
                            <span className="score-key">Anomaly Score</span>
                            <span className="score-val">{result.Anomaly?.Anomaly_Score?.toFixed(4)}</span>
                        </div>
                        <ul className="factor-list">
                            {result.Anomaly?.top_factors?.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                    </div>
                </div>

                {/* ── 4. Risk Label ── */}
                <div className="decision-card-inner" style={{ borderLeftColor: "var(--secondary)", background: "#f0f8ff" }}>
                    <div className="card-label-col">
                        <div className="card-title">
                            <span className="card-title-dot" style={{ background: "var(--secondary)" }} />
                            Risk Label
                        </div>
                    </div>
                    <div className="card-value-col">
                        <div className="risk-value" style={{ color: "var(--secondary)" }}>
                            {result.RiskLabel?.Risk_Label}
                        </div>
                        <ul className="factor-list">
                            {result.RiskLabel?.Drivers?.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                    </div>
                </div>

                {/* ── 5. Recommendation ── */}
                <div className="recommendation-box">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                        <div>
                            <span className="recommendation-label">⚡ Recommendation</span>
                            <h3 className="recommendation-title">
                                {result.RL_Recommendation?.Recommendation}
                            </h3>
                        </div>
                        <div style={{ opacity: 0.18, fontSize: "3rem", flexShrink: 0 }}>🛡️</div>
                    </div>
                    <div className="recommendation-divider" />
                    <ul
                        className="factor-list"
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                            gap: "0.75rem",
                        }}
                    >
                        {result.RL_Recommendation?.Rationales?.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                </div>

            </div>
        </div>
    );
}

export default MlDecisionResult;
