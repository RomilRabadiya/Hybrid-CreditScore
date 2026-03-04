import { useState } from "react";
import { generateBankStatement } from "../api/bankStatementAPI";
import { extractFeatures } from "../api/featureExtractorAPI";
import { getCreditDecision } from "../api/mlApiAPI";
import MlDecisionResult from "../components/MlDecisionResult";
import BankStatementInput from "../components/BankStatementInput";

// CreditDecisionPage : Full end-to-end Hybrid Credit Score pipeline
// Step 1 : Generate bank transactions    → bankStatementAPI
// Step 2 : Extract ML features           → featureExtractorAPI
// Step 3 : Get credit decision from ML   → mlApiAPI

function CreditDecisionPage() {
    const [pan, setPan] = useState("");
    const [accountId, setAccountId] = useState("");
    // result is the final credit decision ultimately returned by the ML API
    // result is outcome of our ML - Credit Decision Engine
    const [result, setResult] = useState(null);

    const handleGetDecision = async () => {
        if (!pan || !accountId) {
            alert("Please enter PAN and Account ID");
            return;
        }

        try {
            setResult(null);
            // Step 1 : Generate bank transactions
            const transactions = await generateBankStatement(pan, accountId);
            // Step 2 : Extract ML features
            const analysis = await extractFeatures(transactions);
            // Step 3 : Get credit decision from ML
            const decision = await getCreditDecision(analysis);

            setResult(decision);
        }
        catch (err) {
            console.error("Error fetching bank statement:", err);
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Hybrid Credit Decision</h2>
            <p>
                Full pipeline: Bank Statement → Feature Extraction → ML Credit Decision
            </p>

            {/* Input Form Component */}
            <BankStatementInput
                pan={pan}
                setPan={setPan}
                accountId={accountId}
                setAccountId={setAccountId}
                onGenerate={handleGetDecision}
            />

            {/* Credit Decision Result Component */}
            <MlDecisionResult result={result} />
        </div>
    );
}

export default CreditDecisionPage;
