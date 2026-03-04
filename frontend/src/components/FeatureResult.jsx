function FeatureResult({ analysis }) {
    if (!analysis) return null;

    // It will display the 7 extracted ML features from BankStatementAnalysis

    // features : Array of objects 
    // Each object has key , label , unit , description
    const features = [
        { key: "avgMonthlyIncome", label: "Avg Monthly Income", unit: "₹" },
        { key: "incomeCV", label: "Income Coefficient (CV)", unit: "" },
        { key: "expenseRatio", label: "Expense Ratio", unit: "" },
        { key: "emiRatio", label: "EMI Ratio", unit: "" },
        { key: "avgMonthlyBalance", label: "Avg Monthly Balance", unit: "₹" },
        { key: "bounceCount", label: "Bounce Count", unit: "" },
        { key: "accountAgeMonths", label: "Account Age", unit: "mo" },
    ];

    return (
        <div>
            <h3>Extracted ML Features</h3>
            <table>
                <thead>
                    <tr>
                        <th>Feature</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Iterate over features array and display each feature */}
                    {features.map(({ key, label, unit }) => (
                        <tr key={key}>
                            <td><strong>{label}</strong></td>
                            <td>
                                {unit === "₹"
                                    ? `₹ ${Number(analysis[key]).toLocaleString("en-IN")}`
                                    : `${Number(analysis[key]).toFixed(4)} ${unit}`}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FeatureResult;
