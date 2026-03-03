import { useState } from "react";
import { generateBankStatement } from "../api/bankStatementAPI";
import BankStatementInput from "../components/BankStatementInput";
import BankStatement from "../components/BankStatement";

// BankStatementPage : Orchestrator Page Component
// - Holds all state (pan, accountId, transactions, loading, error)
// - Calls the API
// - Passes data down to BankStatementInput and BankStatement

function BankStatementPage() {
    const [pan, setPan] = useState("");
    const [accountId, setAccountId] = useState("");
    const [transactions, setTransactions] = useState([]);

    // Loading State : 
    const [loading, setLoading] = useState(false);
    // Error State : 
    const [error, setError] = useState("");

    const handleGenerate = async () => {
        if (!pan || !accountId) {
            alert("Please enter PAN and Account ID");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await generateBankStatement(pan, accountId);
            setTransactions(data);
        }
        catch (err) {
            setError("Failed to fetch bank statement");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#ffffff", color: "#213547" }}>
            <h2>Bank Statement Generator</h2>

            {/* Input Form Component */}
            <BankStatementInput
                pan={pan}
                setPan={setPan}
                accountId={accountId}
                setAccountId={setAccountId}
                onGenerate={handleGenerate}
                loading={loading}
            />

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Transactions Table Component */}
            <BankStatement transactions={transactions} />
        </div>
    );
}

export default BankStatementPage;