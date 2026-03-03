package bank.bankStatement.CreditScore.MlAPICall.SupportClass;

import java.util.List;

public class RLRecommendationResponse {
    private String Recommendation;
    private List<String> Rationales;

    public RLRecommendationResponse() {}

    public String getRecommendation() {
        return Recommendation;
    }

    public void setRecommendation(String recommendation) {
        Recommendation = recommendation;
    }

    public List<String> getRationales() {
        return Rationales;
    }

    public void setRationales(List<String> rationales) {
        Rationales = rationales;
    }

    public RLRecommendationResponse(String recommendation, List<String> rationales) {
        Recommendation = recommendation;
        Rationales = rationales;
    }
}
