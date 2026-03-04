// BankStatementInput Component
// Responsibility : Render the PAN + AccountID input form and trigger data fetch

function BankStatementInput({ pan, setPan, accountId, setAccountId, onGenerate }) {
    // Take PAN and AccountID as input and trigger data fetch
    // And PAN and AccountID are passed as props to the BankStatement component by calling setPan and setAccountId
    
    // When Click on Generate Statement button, onGenerate function is called
    // Internally it calls the generateBankStatement function from the API
    // It will Generate the bank statement and return the transactions : Logic in Backend
    return (
        <div style={{ marginBottom: "20px" }}>

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

            <button onClick={onGenerate}>
                Generate Statement
            </button>

        </div>
    );
}

export default BankStatementInput;
