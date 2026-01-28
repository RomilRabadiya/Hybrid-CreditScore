package bank.bankStatement.CreditScore.BankSyntheticData;

/**
 * Represents the risk category of a customer based on their PAN/financial behavior.
 * Used for segmentation and determining transaction patterns.
 */
public enum RiskProfile {
    PRIME,       // Low risk, high income
    NEAR_PRIME,  // Moderate risk, decent income
    MID_RISK,    // Average risk
    SUB_PRIME,   // High risk, low income
    FRAUD        // Potential fraud patterns
}
