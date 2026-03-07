import { useState } from "react";
import { generateBankStatement } from "../api/bankStatementAPI";
import BankStatementInput from "../components/BankStatementInput";
import BankStatement from "../components/BankStatement";

// BankStatementPage : Orchestrator Page Component
// - Holds all state (pan, accountId, transactions)
// - Calls the API
// - Passes data down to BankStatementInput and BankStatement

function BankStatementPage() {
    // pan is use for taking input from user
    const [pan, setPan] = useState("");
    // accountId is use for taking input from user
    const [accountId, setAccountId] = useState("");
    // transactions is an array of objects
    const [transactions, setTransactions] = useState([]);

    const handleGenerate = async () => {
        if (!pan || !accountId) {
            alert("Please enter PAN and Account ID");
            return;
        }

        try {
            const data = await generateBankStatement(pan, accountId);
            setTransactions(data);
        }
        catch (err) {
            console.error("Error fetching bank statement:", err);
            alert("Failed to fetch bank statement");
        }
    };

    return (
        <div className="page-container" style={{ padding: "20px", minHeight: "100vh", backgroundColor: "#ffffff", color: "#213547" }}>
            <h2>Bank Statement Generator</h2>

            {/* Input Form Component */}
            <BankStatementInput
                pan={pan}
                setPan={setPan}
                accountId={accountId}
                setAccountId={setAccountId}
                onGenerate={handleGenerate}
            />

            {/* Transactions Table Component Pass transactions as props*/}
            <BankStatement transactions={transactions} />
        </div>
    );
}

export default BankStatementPage;