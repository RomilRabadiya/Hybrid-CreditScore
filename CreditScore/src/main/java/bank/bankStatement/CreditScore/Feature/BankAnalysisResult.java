package bank.bankStatement.CreditScore.Feature;

import java.math.BigDecimal;

//BankAnalysisResult is a class that is used to store the results of the bank statement analysis.

//BankAnalysisResult Is used on Our ML Model
public class BankAnalysisResult
{
    
//     avgMonthlyIncome    =>	Repayment capacity
//     incomeCV            =>	Income stability
//     expenseRatio        =>	Spending discipline
//     emiRatio            =>	Debt burden
//     avgMonthlyBalance   =>	Liquidity
//     bounceCount         =>	Trust / repayment discipline
//     accountAgeMonths    =>	Credit maturity
//     anomalyDetected     =>	Fraud / risk guardrail

    BigDecimal avgMonthlyIncome;//Average Monthly Income
    BigDecimal incomeCV;//Income Coefficient of Variation

    BigDecimal expenseRatio;//Expense Ratio
    BigDecimal emiRatio;//EMI Ratio

    BigDecimal avgMonthlyBalance;//Average Monthly Balance
    int bounceCount;//Bounce Count

    int accountAgeMonths;//Account Age in Months
    boolean anomalyDetected;//Anomaly Detected

    BankAnalysisResult(BigDecimal avgMonthlyIncome, BigDecimal incomeCV, BigDecimal expenseRatio, BigDecimal emiRatio, BigDecimal avgMonthlyBalance, int bounceCount, int accountAgeMonths, boolean anomalyDetected) {
        this.avgMonthlyIncome = avgMonthlyIncome;
        this.incomeCV = incomeCV;
        this.expenseRatio = expenseRatio;
        this.emiRatio = emiRatio;
        this.avgMonthlyBalance = avgMonthlyBalance;
        this.bounceCount = bounceCount;
        this.accountAgeMonths = accountAgeMonths;
        this.anomalyDetected = anomalyDetected;
    }

    public BigDecimal getAvgMonthlyIncome() {
        return avgMonthlyIncome;
    }

    public BigDecimal getIncomeCV() {
        return incomeCV;
    }

    public BigDecimal getExpenseRatio() {
        return expenseRatio;
    }

    public BigDecimal getEmiRatio() {
        return emiRatio;
    }

    public BigDecimal getAvgMonthlyBalance() {
        return avgMonthlyBalance;
    }

    public int getBounceCount() {
        return bounceCount;
    }

    public int getAccountAgeMonths() {
        return accountAgeMonths;
    }

    public boolean isAnomalyDetected() {
        return anomalyDetected;
    }

    public void setAvgMonthlyIncome(BigDecimal avgMonthlyIncome) {
        this.avgMonthlyIncome = avgMonthlyIncome;
    }

    public void setIncomeCV(BigDecimal incomeCV) {
        this.incomeCV = incomeCV;
    }

    public void setExpenseRatio(BigDecimal expenseRatio) {
        this.expenseRatio = expenseRatio;
    }

    public void setEmiRatio(BigDecimal emiRatio) {
        this.emiRatio = emiRatio;
    }

    public void setAvgMonthlyBalance(BigDecimal avgMonthlyBalance) {
        this.avgMonthlyBalance = avgMonthlyBalance;
    }

    public void setBounceCount(int bounceCount) {
        this.bounceCount = bounceCount;
    }

    public void setAccountAgeMonths(int accountAgeMonths) {
        this.accountAgeMonths = accountAgeMonths;
    }

    public void setAnomalyDetected(boolean anomalyDetected) {
        this.anomalyDetected = anomalyDetected;
    }
}

