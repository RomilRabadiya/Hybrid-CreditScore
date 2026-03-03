import { useState } from "react";
import { generateBankStatement } from "../api/bankStatementAPI";
import { extractFeatures } from "../api/featureExtractorAPI";
import { getCreditDecision } from "../api/mlApiAPI";
import MlDecisionResult from "../components/MlDecisionResult";

// CreditDecisionPage : Full end-to-end Hybrid Credit Score pipeline
// Step 1 : Generate bank transactions    → bankStatementAPI
// Step 2 : Extract ML features           → featureExtractorAPI
// Step 3 : Get credit decision from ML   → mlApiAPI

function CreditDecisionPage() {
    const [pan, setPan] = useState("");
    const [accountId, setAccountId] = useState("");
    const [result, setResult] = useState(null);
    const [step, setStep] = useState("");

    // Loading State :
    const [loading, setLoading] = useState(false);
    // Error State :
    const [error, setError] = useState("");

    const handleGetDecision = async () => {
        if (!pan || !accountId) {
            alert("Please enter PAN and Account ID");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setResult(null);

            // Step 1:
            setStep("📄 Generating bank statement...");
            const transactions = await generateBankStatement(pan, accountId);

            // Step 2:
            setStep("🔬 Extracting ML features...");
            const analysis = await extractFeatures(transactions);

            // Step 3:
            setStep("🤖 Calling Hybrid Credit Score engine...");
            const decision = await getCreditDecision(analysis);

            setResult(decision);
            setStep("");
        }
        catch (err) {
            setError("Failed to get credit decision. Are Spring Boot and FastAPI running?");
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#ffffff", color: "#213547" }}>
            <h2>🏆 Hybrid Credit Decision</h2>
            <p style={{ color: "#555", marginTop: 0 }}>
                Full pipeline: Bank Statement → Feature Extraction → ML Credit Decision
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
                <button onClick={handleGetDecision} disabled={loading}>
                    {loading ? "Processing..." : "Get Credit Decision"}
                </button>
            </div>

            {/* Step Indicator */}
            {loading && step && (
                <p style={{ color: "#4f6ef7", fontWeight: "500" }}>{step}</p>
            )}

            {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

            {/* Credit Decision Result Component */}
            <MlDecisionResult result={result} />
        </div>
    );
}

export default CreditDecisionPage;
