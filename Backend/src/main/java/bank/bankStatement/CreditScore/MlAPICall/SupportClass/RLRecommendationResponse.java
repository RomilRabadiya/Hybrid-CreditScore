package bank.bankStatement.CreditScore.MlAPICall.SupportClass;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class RLRecommendationResponse
{
    @JsonProperty("Recommendation")
    private String Recommendation;

    @JsonProperty("Rationales")
    private List<String> Rationales;

    public RLRecommendationResponse() {}

    public String getRecommendation() { return Recommendation; }
    public void setRecommendation(String recommendation) { Recommendation = recommendation; }

    public List<String> getRationales() { return Rationales; }
    public void setRationales(List<String> rationales) { Rationales = rationales; }
}
