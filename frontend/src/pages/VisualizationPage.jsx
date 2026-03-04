import React, { useState } from "react";
import { generateBankStatement } from "../api/bankStatementAPI";
import { extractFeatures } from "../api/featureExtractorAPI";
import ExplainVisualization from "../components/ExplainVisualization";
import BankStatementInput from "../components/BankStatementInput";

const VisualizationPage = () => {
    const [pan, setPan] = useState("");
    const [accountId, setAccountId] = useState("");

    // analysis : Object Pass to VisualizationController in Backend
    // analysis : { avgMonthlyIncome : number , incomeCV : number , expenseRatio : number , emiRatio : number , avgMonthlyBalance : number , bounceCount : number , accountAgeMonths : number }
    const [analysis, setAnalysis] = useState(null);

    const handleProcess = async () => {
        if (!pan || !accountId) {
            alert("Please enter PAN and Account ID");
            return;
        }

        try {
            setAnalysis(null);

            // Step 1 : Generate Bank Statement
            const transactions = await generateBankStatement(pan, accountId);

            // Step 2 : Extract Features
            const result = await extractFeatures(transactions);

            // Step 3 : Set Analysis
            setAnalysis(result);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Model Explainability</h2>
            <p>
                Visualize how the ML model makes decisions using SHAP values.
            </p>

            <BankStatementInput
                pan={pan}
                setPan={setPan}
                accountId={accountId}
                setAccountId={setAccountId}
                onGenerate={handleProcess}
            />

            {analysis && <ExplainVisualization analysis={analysis} />}
        </div>
    );
};

export default VisualizationPage;
