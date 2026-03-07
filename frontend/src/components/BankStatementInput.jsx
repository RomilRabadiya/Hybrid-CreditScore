// BankStatementInput Component
// Responsibility : Render the PAN + AccountID input form and trigger data fetch

import "../styles/BankStatementInput.css";

// Input Component For Bank Statement : PAN and Account ID
// Responsibility : Get PAN and Account ID from user
// onGenerate is the function called when the button is clicked

function BankStatementInput({ pan, setPan, accountId, setAccountId, onGenerate }) {
    return (
        <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>🔐 Account Verification</h3>
            <div className="input-container">
                <div className="input-group">
                    <label>Tax Identification (PAN)</label>
                    <input
                        className="input-field"
                        type="text"
                        placeholder="ABCDE1234F"
                        value={pan}
                        onChange={(e) => setPan(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <label>Account Reference ID</label>
                    <input
                        className="input-field"
                        type="text"
                        placeholder="ACC-XXXXX"
                        value={accountId}
                        onChange={(e) => setAccountId(e.target.value)}
                    />
                </div>
                <button
                    className="btn generate-btn"
                    onClick={onGenerate}
                >
                    🔄 Generate Activity
                </button>
            </div>
        </div>
    );
}

export default BankStatementInput;
