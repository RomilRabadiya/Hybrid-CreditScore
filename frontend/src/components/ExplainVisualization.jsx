import React, { useState } from "react";
import { getVisualization } from "../api/visualizationAPI";

const ExplainVisualization = ({ analysis }) => {
    const [images, setImages] = useState({
        pd: null,
        anomaly: null,
        hybrid: null,
        risk: null,
    });
    const [loading, setLoading] = useState({
        pd: false,
        anomaly: false,
        hybrid: false,
        risk: false,
    });
    const [error, setError] = useState(null);

    const fetchVisualization = async (type) => {
        if (!analysis) return;
        setLoading((prev) => ({ ...prev, [type]: true }));
        setError(null);
        try {
            const url = await getVisualization(type, analysis);
            setImages((prev) => ({ ...prev, [type]: url }));
        } catch (err) {
            console.error(`Error fetching ${type} visualization:`, err);
            setError(`Failed to fetch ${type} explanation.`);
        } finally {
            setLoading((prev) => ({ ...prev, [type]: false }));
        }
    };

    const types = [
        { id: "pd", label: "Probability of Default (PD)", icon: "📉" },
        { id: "anomaly", label: "Anomaly Detection", icon: "🔍" },
        { id: "hybrid", label: "Hybrid Credit Score", icon: "📊" },
        { id: "risk", label: "Risk Label", icon: "🏷️" },
    ];

    if (!analysis) return null;

    return (
        <div style={{ marginTop: "30px", padding: "20px", border: "1px solid #eee", borderRadius: "12px", backgroundColor: "#fdfdfd" }}>
            <h3 style={{ marginBottom: "20px", color: "#333", borderBottom: "2px solid #4f6ef7", paddingBottom: "10px", display: "inline-block" }}>
                🧠 Model Explainability (SHAP)
            </h3>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "24px" }}>
                Click the buttons below to visualize how each feature contributes to the model's decision using SHAP (SHapley Additive exPlanations).
            </p>

            {error && <p style={{ color: "#dc2626", marginBottom: "20px", fontWeight: "500" }}>⚠️ {error}</p>}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
                {types.map((type) => (
                    <div key={type.id} style={{
                        padding: "16px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "10px",
                        backgroundColor: "#fff",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <h4 style={{ margin: "0 0 16px 0", color: "#374151" }}>{type.icon} {type.label}</h4>

                        {!images[type.id] ? (
                            <button
                                onClick={() => fetchVisualization(type.id)}
                                disabled={loading[type.id]}
                                style={{
                                    padding: "10px 20px",
                                    fontSize: "14px",
                                    borderRadius: "6px",
                                    backgroundColor: loading[type.id] ? "#94a3b8" : "#4f6ef7",
                                    color: "#fff",
                                    border: "none",
                                    cursor: loading[type.id] ? "not-allowed" : "pointer",
                                    transition: "background-color 0.2s"
                                }}
                            >
                                {loading[type.id] ? "⚙️ Generating..." : "Generate Explanation"}
                            </button>
                        ) : (
                            <div style={{ width: "100%", textAlign: "center" }}>
                                <img
                                    src={images[type.id]}
                                    alt={`${type.label} explanation`}
                                    style={{ maxWidth: "100%", borderRadius: "6px", marginBottom: "12px", border: "1px solid #eee" }}
                                />
                                <button
                                    onClick={() => fetchVisualization(type.id)}
                                    disabled={loading[type.id]}
                                    style={{
                                        padding: "6px 12px",
                                        fontSize: "12px",
                                        borderRadius: "4px",
                                        backgroundColor: "#f3f4f6",
                                        color: "#4b5563",
                                        border: "1px solid #d1d5db",
                                        cursor: "pointer"
                                    }}
                                >
                                    {loading[type.id] ? "Refreshing..." : "🔄 Refresh"}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExplainVisualization;
