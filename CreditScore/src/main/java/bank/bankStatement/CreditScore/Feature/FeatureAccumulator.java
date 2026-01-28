package bank.bankStatement.CreditScore.Feature;

import bank.bankStatement.CreditScore.BankTransactionEntity.BankTransaction;
import bank.bankStatement.CreditScore.BankTransactionEntity.TransactionDirection;
import bank.bankStatement.CreditScore.BankTransactionEntity.TransactionNature;
import java.util.Collection;
import java.math.MathContext;
import java.math.RoundingMode;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

//ML Model Input That Calculate by FeatureAccumulator Class accept method

//     avgMonthlyIncome    =>	Repayment capacity
//     incomeCV            =>	Income stability
//     expenseRatio        =>	Spending discipline
//     emiRatio            =>	Debt burden
//     avgMonthlyBalance   =>	Liquidity
//     bounceCount         =>	Trust / repayment discipline
//     accountAgeMonths    =>	Credit maturity
//     anomalyDetected     =>	Fraud / risk guardrail

//FeatureAccumulator is a class that is used to store the results of the bank statement analysis.
//It Will COnvert Bank Transactions to Features of ML Model

//All Bank transaction call accept method
//At the end toResult method call to Make ML Model Input
class FeatureAccumulator 
{

    //Use For Calculate incomeCV
    BigDecimal totalIncome = BigDecimal.ZERO;
    //Calculate ExpenseRatio
    BigDecimal totalExpenses = BigDecimal.ZERO;
    //Calculate EMI Ratio
    BigDecimal totalEmi = BigDecimal.ZERO;

    //Use For Calculate avgMonthlyIncome
    Map<Integer, BigDecimal> monthlyIncome = new HashMap<>();

    //Use For Calculate avgMonthlyBalance
    BigDecimal balanceSum = BigDecimal.ZERO;
    int balanceCount = 0;

    //Use For Calculate bounceCount
    int bounceCount = 0;

    //Use For Calculate accountAgeMonths
    LocalDate firstDate = null;
    LocalDate lastDate = null;

    //Set Feature Accumulator For Each Transaction
    void accept(BankTransaction t) {

        // ---- Account age tracking
        if (firstDate == null || t.getTransactionDate().isBefore(firstDate)) {
            firstDate = t.getTransactionDate();
        }
        if (lastDate == null || t.getTransactionDate().isAfter(lastDate)) {
            lastDate = t.getTransactionDate();
        }

        // ---- Balance tracking
        balanceSum = balanceSum.add(t.getBalanceAfter());
        balanceCount++;

        // ---- Income
        if (t.getDirection() == TransactionDirection.INFLOW &&
            (t.getNature() == TransactionNature.SALARY ||
             t.getNature() == TransactionNature.BUSINESS_INCOME)) {

            totalIncome = totalIncome.add(t.getAmount());

            int month = t.getTransactionDate().getMonthValue();
            monthlyIncome.merge(month, t.getAmount(), BigDecimal::add);
        }

        // ---- EMI
        if (t.getNature() == TransactionNature.EMI) {
            totalEmi = totalEmi.add(t.getAmount());
        }

        // ---- True Expenses (discipline)
        if (t.getDirection() == TransactionDirection.OUTFLOW &&
            t.getNature() != TransactionNature.EMI &&
            t.getNature() != TransactionNature.BANK_CHARGES &&
            t.getNature() != TransactionNature.TAX_PAYMENT &&
            t.getNature() != TransactionNature.GST_PAYMENT) {

            totalExpenses = totalExpenses.add(t.getAmount());
        }

        // ---- Bounce detection
        if (t.getNature() == TransactionNature.BANK_CHARGES) {
            bounceCount++;
        }
    }

    //Convert Feature Accumulator to BankAnalysisResult => ML Model Input
    BankAnalysisResult toResult() 
    {

        //Average Monthly Income = Total Income ÷ Number of Months
        BigDecimal avgMonthlyIncome =
                monthlyIncome.isEmpty()
                        ? BigDecimal.ZERO
                        : totalIncome.divide(
                                BigDecimal.valueOf(monthlyIncome.size()),
                                2,
                                RoundingMode.HALF_UP
                        );

        //Coefficient of Variation = Standard Deviation ÷ Average Income
        BigDecimal incomeCV = calculateCV(monthlyIncome.values());

        //Expense Ratio = Total Expenses ÷ Total Income
        BigDecimal expenseRatio =
                totalIncome.signum() == 0
                        ? BigDecimal.ZERO
                        : totalExpenses.divide(totalIncome, 4, RoundingMode.HALF_UP);
        //EMI Ratio = Total EMI ÷ Total Income
        BigDecimal emiRatio =
                totalIncome.signum() == 0
                        ? BigDecimal.ZERO
                        : totalEmi.divide(totalIncome, 4, RoundingMode.HALF_UP);

        //Average Monthly Balance = Total Balance ÷ Number of Months
        BigDecimal avgBalance =
                balanceCount == 0
                        ? BigDecimal.ZERO
                        : balanceSum.divide(
                                BigDecimal.valueOf(balanceCount),
                                2,
                                RoundingMode.HALF_UP
                        );

        //Account Age in Months = Number of Months between First and Last Transaction
        int accountAgeMonths =
                (firstDate == null || lastDate == null)
                        ? 0
                        : (int) java.time.temporal.ChronoUnit.MONTHS.between(firstDate, lastDate);

        return new BankAnalysisResult(
                avgMonthlyIncome,
                incomeCV,
                expenseRatio,
                emiRatio,
                avgBalance,
                bounceCount,
                accountAgeMonths,
                false // anomaly set later by ML
        );
    }

    private BigDecimal calculateCV(Collection<BigDecimal> values) 
    {
        if (values == null || values.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal sum = BigDecimal.ZERO;
        BigDecimal sumSq = BigDecimal.ZERO;
        for (BigDecimal v : values) {
            sum = sum.add(v);
            sumSq = sumSq.add(v.multiply(v));
        }

        int count = values.size();
        BigDecimal n = BigDecimal.valueOf(count);
        BigDecimal mean = sum.divide(n, MathContext.DECIMAL128);

        if (mean.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        // Variance = (SumSq - (Sum^2)/n) / n  (Population Variance)
        // or (SumSq - (Sum^2)/n) / (n-1) (Sample Variance)
        // Using Population Variance for simplicity or as standard for datasets
        
        BigDecimal meanSq = mean.pow(2);
        BigDecimal avgSumSq = sumSq.divide(n, MathContext.DECIMAL128);
        BigDecimal variance = avgSumSq.subtract(meanSq);
        
        if (variance.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal stdDev = variance.sqrt(MathContext.DECIMAL128);
        
        return stdDev.divide(mean, 4, RoundingMode.HALF_UP);
    }
}
