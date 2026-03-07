import { useState } from "react";
import { generateBankStatement } from "../api/bankStatementAPI";
import { extractFeatures } from "../api/featureExtractorAPI";
import FeatureResult from "../components/FeatureResult";
import BankStatementInput from "../components/BankStatementInput";

// FeatureExtractorPage : Orchestrator
// Step 1 : Generate bank transactions (reuses bankStatementAPI)
// Step 2 : Extract ML features from those transactions (featureExtractorAPI)

function FeatureExtractorPage() {
    const [pan, setPan] = useState("");
    const [accountId, setAccountId] = useState("");
    // analysis : Store the result of the feature extractor API call of Backend
    const [analysis, setAnalysis] = useState(null);

    const handleExtract = async () => {
        if (!pan || !accountId) {
            alert("Please enter PAN and Account ID");
            return;
        }

        try {
            setAnalysis(null);

            // Step 1 : Generate bank transactions
            const transactions = await generateBankStatement(pan, accountId);

            // Step 2 : Send transactions to feature extractor
            const result = await extractFeatures(transactions);
            setAnalysis(result);
        }
        catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="page-container">
            <h2>ML Feature Extractor</h2>
            <p>
                Generates a bank statement and extracts 7 ML features used by the Hybrid Credit Score model.
            </p>

            {/* Input Form */}
            <BankStatementInput
                pan={pan}
                setPan={setPan}
                accountId={accountId}
                setAccountId={setAccountId}
                onGenerate={handleExtract}
            />

            {/* Feature Results Component */}
            <FeatureResult analysis={analysis} />
        </div>
    );
}

export default FeatureExtractorPage;
