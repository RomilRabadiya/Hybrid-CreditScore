package bank.bankStatement.CreditScore.RuleBasedCreditScoreService;

import bank.bankStatement.CreditScore.Feature.BankAnalysisResult;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class RuleBasedCreditScoreService {

    private static final int BASE_SCORE = 500;
    private static final int MIN_SCORE = 300;
    private static final int MAX_SCORE = 900;

    //Calculate Score
    public int calculate(BankAnalysisResult r) 
    {
        int score = BASE_SCORE;

        score += incomeScore(r);
        score += stabilityScore(r);
        score += expenseScore(r);
        score += emiScore(r);
        score += balanceScore(r);
        score += bounceScore(r);
        score += vintageScore(r);
        score += fraudPenalty(r);

        return clamp(score);
    }

    //Sector 1: Income Strength
    private int incomeScore(BankAnalysisResult r) 
    {
        BigDecimal income = r.getAvgMonthlyIncome();

        if (income.compareTo(BigDecimal.valueOf(150_000)) >= 0) return 120;
        if (income.compareTo(BigDecimal.valueOf(100_000)) >= 0) return 80;
        if (income.compareTo(BigDecimal.valueOf(60_000)) >= 0) return 40;

        return -40;
    }

    //Sector 1B: Income Stability
    private int stabilityScore(BankAnalysisResult r) 
    {
        BigDecimal cv = r.getIncomeCV(); // coefficient of variation

        if (cv.compareTo(BigDecimal.valueOf(0.10)) < 0) return 40;
        if (cv.compareTo(BigDecimal.valueOf(0.20)) < 0) return 20;

        return -30;
    }

    //Sector 2: Expense Discipline
    private int expenseScore(BankAnalysisResult r) 
    {
        BigDecimal ratio = r.getExpenseRatio();

        if (ratio.compareTo(BigDecimal.valueOf(0.50)) <= 0) return 80;
        if (ratio.compareTo(BigDecimal.valueOf(0.65)) <= 0) return 40;
        if (ratio.compareTo(BigDecimal.valueOf(0.80)) <= 0) return 0;

        return -60;
    }

    //Sector 3: EMI Burden
    private int emiScore(BankAnalysisResult r) 
    {
        BigDecimal ratio = r.getEmiRatio();

        if (ratio.compareTo(BigDecimal.valueOf(0.30)) <= 0) return 70;
        if (ratio.compareTo(BigDecimal.valueOf(0.40)) <= 0) return 30;
        if (ratio.compareTo(BigDecimal.valueOf(0.50)) <= 0) return -20;

        return -80;
    }

    //Sector 4: Liquidity Buffer
    private int balanceScore(BankAnalysisResult r) 
    {
        BigDecimal balance = r.getAvgMonthlyBalance();

        if (balance.compareTo(BigDecimal.valueOf(100_000)) >= 0) return 60;
        if (balance.compareTo(BigDecimal.valueOf(50_000)) >= 0) return 30;
        if (balance.compareTo(BigDecimal.valueOf(20_000)) >= 0) return 0;

        return -40;
    }

    //Sector 5: Bounce Discipline
    private int bounceScore(BankAnalysisResult r) 
    {
        int bounces = r.getBounceCount();

        if (bounces == 0) return 100;
        if (bounces == 1) return 40;
        if (bounces <= 3) return -50;

        return -120;
    }

    //Sector 6: Account Vintage
    private int vintageScore(BankAnalysisResult r) 
    {
        int months = r.getAccountAgeMonths();

        if (months >= 60) return 60;
        if (months >= 36) return 40;
        if (months >= 12) return 20;

        return -30;
    }

    //Sector 7: Fraud / Anomaly
    private int fraudPenalty(BankAnalysisResult r) 
    {
        return r.isAnomalyDetected() ? -150 : 0;
    }

    //Clamp Final Score
    private int clamp(int score) 
    {
        if (score < MIN_SCORE) return MIN_SCORE;
        if (score > MAX_SCORE) return MAX_SCORE;
        return score;
    }
}
