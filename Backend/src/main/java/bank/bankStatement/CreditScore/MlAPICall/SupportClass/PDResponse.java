package bank.bankStatement.CreditScore.MlAPICall.SupportClass;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class PDResponse
{
    @JsonProperty("Probability_of_Default")
    private double Probability_of_Default;

    @JsonProperty("top_factors")
    private List<String> top_factors;

    public PDResponse() {}

    public double getProbability_of_Default() { return Probability_of_Default; }
    public void setProbability_of_Default(double probability_of_Default) { Probability_of_Default = probability_of_Default; }

    public List<String> getTop_factors() { return top_factors; }
    public void setTop_factors(List<String> top_factors) { this.top_factors = top_factors; }
}
