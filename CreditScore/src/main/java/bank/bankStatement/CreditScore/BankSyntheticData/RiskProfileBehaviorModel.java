package bank.bankStatement.CreditScore.BankSyntheticData;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.util.Random;

@Component
public class RiskProfileBehaviorModel {

    //According to PAN Number Last Character
    public RiskProfile resolveProfile(String pan) 
    {
        if (pan == null || pan.isEmpty()) return RiskProfile.MID_RISK;
        char last = pan.charAt(pan.length() - 1);

        if (last >= 'A' && last <= 'C') return RiskProfile.PRIME;
        if (last >= 'D' && last <= 'F') return RiskProfile.NEAR_PRIME;
        if (last >= 'G' && last <= 'J') return RiskProfile.MID_RISK;
        if (last >= 'K' && last <= 'P') return RiskProfile.SUB_PRIME;
        return RiskProfile.FRAUD;
    }

    //Monthly Income based on Profile
    public BigDecimal monthlyIncome(RiskProfile p, Random r) {
        return switch (p) {
            case PRIME -> BigDecimal.valueOf(180_000 + r.nextInt(40_000));
            case NEAR_PRIME -> BigDecimal.valueOf(120_000 + r.nextInt(30_000));
            case MID_RISK -> BigDecimal.valueOf(90_000 + r.nextInt(20_000));
            case SUB_PRIME -> BigDecimal.valueOf(60_000 + r.nextInt(20_000));
            case FRAUD -> BigDecimal.valueOf(40_000 + r.nextInt(30_000));
        };
    }

    //Initial Balance based on Profile
    public BigDecimal initialBalance(RiskProfile profile, Random rng) {
        return switch (profile) {
            case PRIME -> BigDecimal.valueOf(150_000 + rng.nextInt(50_000));
            case NEAR_PRIME -> BigDecimal.valueOf(80_000 + rng.nextInt(40_000));
            case MID_RISK -> BigDecimal.valueOf(40_000 + rng.nextInt(30_000));
            case SUB_PRIME -> BigDecimal.valueOf(20_000 + rng.nextInt(20_000));
            case FRAUD -> BigDecimal.valueOf(5_000 + rng.nextInt(10_000));
        };
    }

    //EMI Amount based on Profile
    public BigDecimal emiAmount(RiskProfile p, Random r) {
        return switch (p) {
            case PRIME -> BigDecimal.valueOf(30_000);
            case NEAR_PRIME -> BigDecimal.valueOf(40_000);
            case MID_RISK -> BigDecimal.valueOf(45_000);
            case SUB_PRIME -> BigDecimal.valueOf(50_000);
            case FRAUD -> BigDecimal.valueOf(55_000);
        };
    }

    //Number of Daily Transactions based on Profile
    public int dailyTxnCount(RiskProfile p, Random r) {
        return switch (p) {
            case PRIME -> 3 + r.nextInt(3);
            case NEAR_PRIME -> 4 + r.nextInt(4);
            case MID_RISK -> 6 + r.nextInt(4);
            case SUB_PRIME -> 8 + r.nextInt(5);
            case FRAUD -> 15 + r.nextInt(10);
        };
    }

    //Random Expense based on Profile
    public BigDecimal randomExpense(RiskProfile p, Random r) {
        return switch (p) {
            case PRIME -> BigDecimal.valueOf(1_000 + r.nextInt(2_000));
            case NEAR_PRIME -> BigDecimal.valueOf(1_500 + r.nextInt(3_000));
            case MID_RISK -> BigDecimal.valueOf(2_000 + r.nextInt(4_000));
            case SUB_PRIME -> BigDecimal.valueOf(3_000 + r.nextInt(5_000));
            case FRAUD -> BigDecimal.valueOf(5_000 + r.nextInt(10_000));
        };
    }
}
