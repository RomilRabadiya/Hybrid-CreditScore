package bank.bankStatement.CreditScore.MlAPICall.SupportClass;

import java.util.List;

public class HybridScoreResponse {
    private double Hybrid_Score;
    private List<String> factors;

    public HybridScoreResponse() {}

    public double getHybrid_Score() {
        return Hybrid_Score;
    }

    public void setHybrid_Score(double hybrid_Score) {
        Hybrid_Score = hybrid_Score;
    }

    public List<String> getFactors() {
        return factors;
    }

    public HybridScoreResponse(double hybrid_Score, List<String> factors) {
        Hybrid_Score = hybrid_Score;
        this.factors = factors;
    }

    public void setFactors(List<String> factors) {
        this.factors = factors;
    }
}
