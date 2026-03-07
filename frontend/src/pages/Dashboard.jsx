import { useState } from "react";
import { generateBankStatement } from "../api/bankStatementAPI";
import { extractFeatures } from "../api/featureExtractorAPI";
import { getCreditDecision } from "../api/mlApiAPI";
import BankStatementInput from "../components/BankStatementInput";
import BankStatement from "../components/BankStatement";
import FeatureResult from "../components/FeatureResult";
import MlDecisionResult from "../components/MlDecisionResult";
import ExplainVisualization from "../components/ExplainVisualization";
import "../styles/Dashboard.css";

// Dashboard Component : Unified Credit Assessment Platform
// This combines all steps of the credit assessment process into a single, high-end interface.
// Step 1 : Data Input (Bank Details)
// Step 2 : Data Display (Statement & Features)
// Step 3 : Decision Engine (ML Prediction)
// Step 4 : Explanation (SHAP Visuals)

function Dashboard() {
    const [pan, setPan] = useState("");
    const [accountId, setAccountId] = useState("");

    const [transactions, setTransactions] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [decision, setDecision] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    // handleProcess : Fetches Bank Statement and Extracts Features
    const handleInitialProcess = async () => {
        if (!pan || !accountId) {
            alert("Please enter PAN and Account ID");
            return;
        }

        try {
            setLoading(true);
            setTransactions([]);
            setAnalysis(null);
            setDecision(null);
            setShowExplanation(false);

            // Step 1 : Generate bank transactions
            const txns = await generateBankStatement(pan, accountId);
            setTransactions(txns);

            // Step 2 : Extract ML features
            const featAnalysis = await extractFeatures(txns);
            setAnalysis(featAnalysis);

            setLoading(false);
        } catch (err) {
            console.error("Dashboard Process Error:", err);
            setLoading(false);
        }
    };

    // handleGetDecision : Final ML Credit Evaluation
    const handleGetDecision = async () => {
        if (!analysis) return;
        try {
            setLoading(true);
            const res = await getCreditDecision(analysis);
            setDecision(res);
            setLoading(false);
        } catch (err) {
            console.error("Decision Error:", err);
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: '1400px' }}>
            <header className="dashboard-header">
                <h1>Hybrid Credit Score Dashboard</h1>
                <p>Credit Scoring & Risk Analytics System</p>
            </header>

            {/* Step 1 : Input Section */}
            <section className="step-card">
                <BankStatementInput
                    pan={pan}
                    setPan={setPan}
                    accountId={accountId}
                    setAccountId={setAccountId}
                    onGenerate={handleInitialProcess}
                />
            </section>

            {loading && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div className="spinner">⌛ Processing Financial Data...</div>
                </div>
            )}

            {/* Step 2 : Data Display Section */}
            {transactions.length > 0 && analysis && (
                <section className="step-card">
                    <div className="dashboard-grid">
                        <div>
                            <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-soft)' }}>Bank Statement</h3>
                            <BankStatement transactions={transactions} />
                        </div>
                        <div>
                            <h3 style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-soft)' }}>Extracted Features</h3>
                            <FeatureResult analysis={analysis} />
                        </div>
                    </div>

                    {!decision && (
                        <div className="action-bar">
                            <button className="btn btn-primary" onClick={handleGetDecision} style={{ fontSize: '1.2rem', padding: '1.2rem 2.5rem' }}>
                                Run Credit Decision
                            </button>
                        </div>
                    )}
                </section>
            )}

            {/* Step 3 : Decision Result Section */}
            {decision && (
                <section className="step-card">
                    <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)', fontSize: '1.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Evaluation Output</h3>
                    <MlDecisionResult result={decision} />

                    {!showExplanation && (
                        <div className="action-bar">
                            <button className="btn" onClick={() => setShowExplanation(true)} style={{ background: 'var(--primary)', color: 'white', fontSize: '1.1rem', padding: '1rem 2rem' }}>
                                Run Model Explanation (SHAP)
                            </button>
                        </div>
                    )}
                </section>
            )}

            {/* Step 4 : Explainability Section */}
            {showExplanation && analysis && (
                <section className="step-card">
                    <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--secondary)', fontSize: '1.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>SHAP Interpretability Audit</h3>
                    <ExplainVisualization analysis={analysis} />
                </section>
            )}
        </div>
    );
}

export default Dashboard;
