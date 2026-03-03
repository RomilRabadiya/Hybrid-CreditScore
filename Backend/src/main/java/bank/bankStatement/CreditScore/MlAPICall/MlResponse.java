package bank.bankStatement.CreditScore.MlAPICall;

import bank.bankStatement.CreditScore.MlAPICall.SupportClass.*;
import com.fasterxml.jackson.annotation.JsonProperty;

// MIMP : JSON Object To Java Object 
// For this we need to use @JsonProperty annotation in the MlResponse class
// @JsonProperty is used to map JSON object to Java object
// API-CreditDecisionEngine returns JSON object and we are deserializing it into MlResponse class


// 🧠 In One Line :
// @JsonProperty = “Match this Java field to this JSON field.”

public class MlResponse {

    @JsonProperty("PD")
    private PDResponse PD;

    @JsonProperty("Anomaly")
    private AnomalyResponse Anomaly;

    @JsonProperty("RiskLabel")
    private RiskLabelResponse RiskLabel;

    @JsonProperty("HybridScore")
    private HybridScoreResponse HybridScore;

    @JsonProperty("RL_Recommendation")
    private RLRecommendationResponse RL_Recommendation;

    // No-arg constructor required by Jackson
    public MlResponse() {}

    public PDResponse getPD() { return PD; }
    public void setPD(PDResponse PD) { this.PD = PD; }

    public AnomalyResponse getAnomaly() { return Anomaly; }
    public void setAnomaly(AnomalyResponse anomaly) { Anomaly = anomaly; }

    public RiskLabelResponse getRiskLabel() { return RiskLabel; }
    public void setRiskLabel(RiskLabelResponse riskLabel) { RiskLabel = riskLabel; }

    public HybridScoreResponse getHybridScore() { return HybridScore; }
    public void setHybridScore(HybridScoreResponse hybridScore) { HybridScore = hybridScore; }

    public RLRecommendationResponse getRL_Recommendation() { return RL_Recommendation; }
    public void setRL_Recommendation(RLRecommendationResponse RL_Recommendation) { this.RL_Recommendation = RL_Recommendation; }
}