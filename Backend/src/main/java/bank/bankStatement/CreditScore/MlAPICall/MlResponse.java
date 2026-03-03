package bank.bankStatement.CreditScore.MlAPICall;

import bank.bankStatement.CreditScore.MlAPICall.SupportClass.*;


public class MlResponse {

    private PDResponse PD;
    private AnomalyResponse Anomaly;
    private RiskLabelResponse RiskLabel;
    private HybridScoreResponse HybridScore;
    private RLRecommendationResponse RL_Recommendation;

    // No-arg constructor required by Jackson
    public MlResponse() {}

    public PDResponse getPD() {
        return PD;
    }

    public void setPD(PDResponse PD) {
        this.PD = PD;
    }

    public AnomalyResponse getAnomaly() {
        return Anomaly;
    }

    public void setAnomaly(AnomalyResponse anomaly) {
        Anomaly = anomaly;
    }

    public RiskLabelResponse getRiskLabel() {
        return RiskLabel;
    }

    public void setRiskLabel(RiskLabelResponse riskLabel) {
        RiskLabel = riskLabel;
    }

    public HybridScoreResponse getHybridScore() {
        return HybridScore;
    }

    public void setHybridScore(HybridScoreResponse hybridScore) {
        HybridScore = hybridScore;
    }

    public RLRecommendationResponse getRL_Recommendation() {
        return RL_Recommendation;
    }

    public MlResponse(PDResponse PD, AnomalyResponse anomaly, RiskLabelResponse riskLabel, RLRecommendationResponse RL_Recommendation, HybridScoreResponse hybridScore) {
        this.PD = PD;
        Anomaly = anomaly;
        RiskLabel = riskLabel;
        this.RL_Recommendation = RL_Recommendation;
        HybridScore = hybridScore;
    }

    public void setRL_Recommendation(RLRecommendationResponse RL_Recommendation) {
        this.RL_Recommendation = RL_Recommendation;
    }

}
