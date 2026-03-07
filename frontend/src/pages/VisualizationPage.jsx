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
        <div className="page-container" style={{ perspective: '1000px' }}>
            <div className="dashboard-header" style={{ background: 'var(--grad-premium)', border: 'none' }}>
                <span className="status-tag" style={{ background: 'var(--accent)', color: '#0f172a', marginBottom: '1.5rem', display: 'inline-block' }}>
                    Process: SHAP Interpretation
                </span>
                <h1 style={{ fontWeight: 900, fontSize: '3.5rem' }}>Model Explanation</h1>
                <p>Feature importance and explainability analysis for model interpretation.</p>
            </div>

            <div className="step-card" style={{ animationDelay: '0.1s' }}>
                <BankStatementInput
                    pan={pan}
                    setPan={setPan}
                    accountId={accountId}
                    setAccountId={setAccountId}
                    onGenerate={handleProcess}
                />
            </div>

            {analysis && (
                <div className="step-card" style={{ animationDelay: '0.3s' }}>
                    <ExplainVisualization analysis={analysis} />
                </div>
            )}
        </div>
    );
};

export default VisualizationPage;
