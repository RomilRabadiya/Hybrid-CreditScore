package bank.bankStatement.CreditScore.MLFeatureAccumulator;

import bank.bankStatement.CreditScore.BankTransactionEntity.BankTransaction;
import bank.bankStatement.CreditScore.BankTransactionEntity.TransactionDirection;
import bank.bankStatement.CreditScore.BankTransactionEntity.TransactionNature;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/*
 * ============================================================================
 * FEATURE ACCUMULATOR (STREAM API VERSION)
 * ============================================================================
 *
 * Converts Raw Bank Transactions -> ML Features
 *
 * Features Generated:
 *
 * 1. avgMonthlyIncome
 * 2. incomeCV
 * 3. expenseRatio
 * 4. emiRatio
 * 5. avgMonthlyBalance
 * 6. bounceCount
 * 7. accountAgeMonths
 *
 * Java Stream Operations Used:
 *
 * filter()
 * map()
 * groupingBy()
 * reduce()
 * count()
 * collect()
 *
 * ============================================================================
 */

public class FeatureAccumulator {

    public BankStatementAnalysis analyze(List<BankTransaction> transactions) {

        if (transactions == null || transactions.isEmpty()) {
            return new BankStatementAnalysis(
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    BigDecimal.ZERO,
                    0,
                    0);
        }

        /*
         * ===============================================================
         * FEATURE 1 : AVG MONTHLY INCOME
         * ===============================================================
         */

        Map<Integer, BigDecimal> monthlyIncome = transactions.stream()

                .filter(t ->
                        t.getDirection() == TransactionDirection.INFLOW
                                && t.getNature() == TransactionNature.BUSINESS_INCOME)

                .collect(Collectors.groupingBy(
                        t -> t.getTransactionDate().getMonthValue(),

                        Collectors.mapping(
                                BankTransaction::getAmount,

                                Collectors.reducing(
                                        BigDecimal.ZERO,
                                        BigDecimal::add))));

        BigDecimal totalIncome = monthlyIncome.values()
                .stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal avgMonthlyIncome = monthlyIncome.isEmpty()
                ? BigDecimal.ZERO
                : totalIncome.divide(
                BigDecimal.valueOf(12),
                2,
                RoundingMode.HALF_UP);

        /*
         * ===============================================================
         * FEATURE 2 : INCOME COEFFICIENT OF VARIATION
         * ===============================================================
         */

        BigDecimal incomeCV = calculateCV(monthlyIncome.values());

        /*
         * ===============================================================
         * FEATURE 3 : EXPENSE RATIO
         *
         * Expense Ratio =
         * Total Expenses / Total Income
         * ===============================================================
         */

        BigDecimal totalExpenses = transactions.stream()

                .filter(t ->
                        t.getDirection() == TransactionDirection.OUTFLOW
                                && t.getNature() != TransactionNature.EMI
                                && t.getNature() != TransactionNature.BANK_CHARGES
                                && t.getNature() != TransactionNature.TAX_PAYMENT
                                && t.getNature() != TransactionNature.GST_PAYMENT)

                .map(BankTransaction::getAmount)

                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal expenseRatio = totalIncome.signum() == 0
                ? BigDecimal.ZERO
                : totalExpenses.divide(
                totalIncome,
                4,
                RoundingMode.HALF_UP);

        /*
         * ===============================================================
         * FEATURE 4 : EMI RATIO
         *
         * EMI Ratio =
         * Total EMI / Total Income
         * ===============================================================
         */

        BigDecimal totalEmi = transactions.stream()

                .filter(t ->
                        t.getNature() == TransactionNature.EMI)

                .map(BankTransaction::getAmount)

                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal emiRatio = totalIncome.signum() == 0
                ? BigDecimal.ZERO
                : totalEmi.divide(
                totalIncome,
                4,
                RoundingMode.HALF_UP);

        /*
         * ===============================================================
         * FEATURE 5 : AVERAGE MONTHLY BALANCE
         * ===============================================================
         */

        BigDecimal totalBalance = transactions.stream()

                .map(BankTransaction::getBalanceAfter)

                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal avgMonthlyBalance = totalBalance.divide(
                BigDecimal.valueOf(transactions.size()),
                2,
                RoundingMode.HALF_UP);

        /*
         * ===============================================================
         * FEATURE 6 : BOUNCE COUNT
         * ===============================================================
         */

        int bounceCount = (int) transactions.stream()

                .filter(t ->
                        t.getNature() == TransactionNature.BANK_CHARGES)

                .count();

        /*
         * ===============================================================
         * FEATURE 7 : ACCOUNT AGE IN MONTHS
         * ===============================================================
         */

        LocalDate firstDate = transactions.stream()

                .map(BankTransaction::getTransactionDate)

                .min(LocalDate::compareTo)

                .orElse(null);

        LocalDate lastDate = transactions.stream()

                .map(BankTransaction::getTransactionDate)

                .max(LocalDate::compareTo)

                .orElse(null);

        int accountAgeMonths =
                (firstDate == null || lastDate == null)
                        ? 0
                        : (int) ChronoUnit.MONTHS.between(firstDate, lastDate);

        /*
         * ===============================================================
         * FINAL ML MODEL INPUT
         * ===============================================================
         */

        return new BankStatementAnalysis(
                avgMonthlyIncome,
                incomeCV,
                expenseRatio,
                emiRatio,
                avgMonthlyBalance,
                bounceCount,
                accountAgeMonths);
    }

    /*
     * ===============================================================
     * CALCULATE COEFFICIENT OF VARIATION
     *
     * CV = StandardDeviation / Mean
     * ===============================================================
     */

    private BigDecimal calculateCV(Collection<BigDecimal> values) {

        if (values == null || values.isEmpty()) {
            return BigDecimal.ZERO;
        }

        BigDecimal sum = values.stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal sumSq = values.stream()
                .map(v -> v.multiply(v))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int count = values.size();

        BigDecimal n = BigDecimal.valueOf(count);

        BigDecimal mean =
                sum.divide(n, MathContext.DECIMAL128);

        if (mean.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal avgSumSq =
                sumSq.divide(n, MathContext.DECIMAL128);

        BigDecimal variance =
                avgSumSq.subtract(mean.pow(2));

        if (variance.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal stdDev =
                variance.sqrt(MathContext.DECIMAL128);

        return stdDev.divide(
                mean,
                4,
                RoundingMode.HALF_UP);
    }
}
