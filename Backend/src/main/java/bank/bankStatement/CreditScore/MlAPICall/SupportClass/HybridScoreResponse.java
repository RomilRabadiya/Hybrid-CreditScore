package bank.bankStatement.CreditScore.MlAPICall.SupportClass;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class HybridScoreResponse
{
    @JsonProperty("Hybrid_Score")
    private double Hybrid_Score;

    @JsonProperty("factors")
    private List<String> factors;

    public HybridScoreResponse() {}

    public double getHybrid_Score() { return Hybrid_Score; }
    public void setHybrid_Score(double hybrid_Score) { Hybrid_Score = hybrid_Score; }

    public List<String> getFactors() { return factors; }
    public void setFactors(List<String> factors) { this.factors = factors; }
}
