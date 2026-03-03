// BankStatementInput Component
// Responsibility : Render the PAN + AccountID input form and trigger data fetch

function BankStatementInput({ pan, setPan, accountId, setAccountId, onGenerate, loading }) {
    return (
        <div style={{ marginBottom: "20px" }}>

            <input
                type="text"
                placeholder="Enter PAN"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                style={{ marginRight: "10px" }}
            />

            <input
                type="text"
                placeholder="Enter Account ID"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                style={{ marginRight: "10px" }}
            />

            <button onClick={onGenerate} disabled={loading}>
                {loading ? "Loading..." : "Generate Statement"}
            </button>

        </div>
    );
}

export default BankStatementInput;
