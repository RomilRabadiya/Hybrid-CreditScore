import { useState } from "react";
import { generateBankStatement } from "../api/bankStatementAPI";
import { extractFeatures } from "../api/featureExtractorAPI";
import FeatureResult from "../components/FeatureResult";

// FeatureExtractorPage : Orchestrator
// Step 1 : Generate bank transactions (reuses bankStatementAPI)
// Step 2 : Extract ML features from those transactions (featureExtractorAPI)

function FeatureExtractorPage() {
    const [pan, setPan] = useState("");
    const [accountId, setAccountId] = useState("");
    const [analysis, setAnalysis] = useState(null);

    // Loading State :
    const [loading, setLoading] = useState(false);
    // Error State :
    const [error, setError] = useState("");

    const handleExtract = async () => {
        if (!pan || !accountId) {
            alert("Please enter PAN and Account ID");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setAnalysis(null);

            // Step 1 : Generate bank transactions
            const transactions = await generateBankStatement(pan, accountId);

            // Step 2 : Send transactions to feature extractor
            const result = await extractFeatures(transactions);
            setAnalysis(result);
        }
        catch (err) {
            setError("Failed to extract features. Is Spring Boot running?");
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#ffffff", color: "#213547" }}>
            <h2>🔬 ML Feature Extractor</h2>
            <p style={{ color: "#555", marginTop: 0 }}>
                Generates a bank statement and extracts 7 ML features used by the Hybrid Credit Score model.
            </p>

            {/* Input Form */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                <input
                    type="text"
                    placeholder="Enter PAN (e.g. ABCD1234F)"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Enter Account ID (e.g. ACC001)"
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                />
                <button onClick={handleExtract} disabled={loading}>
                    {loading ? "Extracting..." : "Extract Features"}
                </button>
            </div>

            {loading && <p>⏳ Generating statement and extracting features...</p>}
            {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

            {/* Feature Results Component */}
            <FeatureResult analysis={analysis} />
        </div>
    );
}

export default FeatureExtractorPage;
