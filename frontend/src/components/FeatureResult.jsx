// FeatureResult Component
// Responsibility : Display the 7 extracted ML features from BankStatementAnalysis

function FeatureResult({ analysis }) {
    if (!analysis) return null;

    // Each feature with its label and description
    const features = [
        { key: "avgMonthlyIncome", label: "Avg Monthly Income", unit: "₹", description: "Repayment capacity" },
        { key: "incomeCV", label: "Income Coefficient (CV)", unit: "", description: "Income stability (lower = more stable)" },
        { key: "expenseRatio", label: "Expense Ratio", unit: "", description: "Spending discipline (lower = better)" },
        { key: "emiRatio", label: "EMI Ratio", unit: "", description: "Existing debt burden" },
        { key: "avgMonthlyBalance", label: "Avg Monthly Balance", unit: "₹", description: "Liquidity reserve" },
        { key: "bounceCount", label: "Bounce Count", unit: "", description: "Payment bounces (lower = better)" },
        { key: "accountAgeMonths", label: "Account Age", unit: "mo", description: "Credit maturity" },
    ];

    return (
        <div style={{ marginTop: "30px" }}>
            <h3>📊 Extracted ML Features</h3>
            <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr style={{ backgroundColor: "#4f6ef7", color: "#fff" }}>
                        <th style={{ textAlign: "left" }}>Feature</th>
                        <th style={{ textAlign: "right" }}>Value</th>
                        <th style={{ textAlign: "left" }}>Meaning</th>
                    </tr>
                </thead>
                <tbody>
                    {features.map(({ key, label, unit, description }, i) => (
                        <tr key={key} style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#fff" }}>
                            <td><strong>{label}</strong></td>
                            <td style={{ textAlign: "right" }}>
                                {unit === "₹"
                                    ? `₹ ${Number(analysis[key]).toLocaleString("en-IN")}`
                                    : `${Number(analysis[key]).toFixed(4)} ${unit}`}
                            </td>
                            <td style={{ color: "#555", fontSize: "13px" }}>{description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FeatureResult;
