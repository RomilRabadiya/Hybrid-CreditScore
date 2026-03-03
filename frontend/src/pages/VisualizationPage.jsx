import React, { useState } from "react";
import { generateBankStatement } from "../api/bankStatementAPI";
import { extractFeatures } from "../api/featureExtractorAPI";
import ExplainVisualization from "../components/ExplainVisualization";

const VisualizationPage = () => {
    const [pan, setPan] = useState("");
    const [accountId, setAccountId] = useState("");
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState("");

    const handleProcess = async () => {
        if (!pan || !accountId) {
            alert("Please enter PAN and Account ID");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setAnalysis(null);
            setStep("📄 Generating bank statement...");

            const transactions = await generateBankStatement(pan, accountId);

            setStep("🔬 Extracting ML features...");
            const result = await extractFeatures(transactions);

            setAnalysis(result);
            setStep("");
        } catch (err) {
            console.error(err);
            setError("Failed to process data. Check if backend services are running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#ffffff", color: "#213547" }}>
            <h2>🧠 Model Explainability</h2>
            <p style={{ color: "#555", marginTop: 0 }}>
                Visualize how the ML model makes decisions using SHAP values.
            </p>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                <input
                    type="text"
                    placeholder="Enter PAN"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Account ID"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                />
                <button onClick={handleProcess} disabled={loading}>
                    {loading ? "Processing..." : "Analyze for Explanation"}
                </button>
            </div>

            {loading && step && (
                <p style={{ color: "#4f6ef7", fontWeight: "500" }}>{step}</p>
            )}

            {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

            {analysis && (
                <div style={{ marginTop: "20px" }}>
                    <div style={{ padding: "12px", backgroundColor: "#f0f4ff", borderRadius: "8px", border: "1px solid #d0d7de", marginBottom: "20px" }}>
                        <p style={{ margin: 0, fontSize: "14px", color: "#24292f" }}>
                            ✅ Features extracted successfully. You can now generate SHAP explanations below.
                        </p>
                    </div>
                    <ExplainVisualization analysis={analysis} />
                </div>
            )}
        </div>
    );
};

export default VisualizationPage;
