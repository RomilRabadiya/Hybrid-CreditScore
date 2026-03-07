import "../styles/FeatureResult.css";
function FeatureResult({ analysis }) {
    if (!analysis) return null;

    // It will display the 7 extracted ML features from BankStatementAnalysis

    // features : Array of objects 
    // analysis is the object containing 7 ML features ultimately returned FeatureExtractorService Backend
    // { avgMonthlyIncome, incomeCV, expenseRatio, emiRatio, avgMonthlyBalance, bounceCount, accountAgeMonths }

    const features = [
        { key: "Income (Avg)", val: analysis.avgMonthlyIncome, icon: "💰" },
        { key: "Income Stability (CV)", val: analysis.incomeCV, icon: "📈" },
        { key: "Expense Ratio", val: (analysis.expenseRatio * 100).toFixed(1) + "%", icon: "📉" },
        { key: "EMI Ratio", val: (analysis.emiRatio * 100).toFixed(1) + "%", icon: "💳" },
        { key: "Avg Balance", val: analysis.avgMonthlyBalance, icon: "🏦" },
        { key: "Bounces", val: analysis.bounceCount, icon: "⚠️" },
        { key: "Account Age (m)", val: analysis.accountAgeMonths, icon: "⏳" }
    ];

    // Ml Features Response In Card Format
    return (
        <div style={{ marginTop: '1.5rem' }}>
            <div className="feature-grid">
                {features.map((f, i) => (
                    <div key={i} className="feature-item">
                        <div className="feature-header">
                            <div className="feature-icon">{f.icon}</div>
                            <span className="feature-name">{f.key}</span>
                        </div>
                        <div className="feature-value">
                            <span>{f.val}</span>
                        </div>
                        <div className="feature-spark"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FeatureResult;
