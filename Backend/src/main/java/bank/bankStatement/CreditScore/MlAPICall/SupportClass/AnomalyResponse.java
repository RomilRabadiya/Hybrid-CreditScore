package bank.bankStatement.CreditScore.MlAPICall.SupportClass;

import java.util.List;

public class AnomalyResponse {
    private double Anomaly_Score;
    private int Anomaly_Flag; // 1 = anomaly detected, 0 = normal
    private List<String> top_factors;

    public AnomalyResponse() {}

    public double getAnomaly_Score() {
        return Anomaly_Score;
    }

    public void setAnomaly_Score(double anomaly_Score) {
        Anomaly_Score = anomaly_Score;
    }

    public int getAnomaly_Flag() {
        return Anomaly_Flag;
    }

    public void setAnomaly_Flag(int anomaly_Flag) {
        Anomaly_Flag = anomaly_Flag;
    }

    public AnomalyResponse(double anomaly_Score, int anomaly_Flag, List<String> top_factors) {
        Anomaly_Score = anomaly_Score;
        Anomaly_Flag = anomaly_Flag;
        this.top_factors = top_factors;
    }

    public List<String> getTop_factors() {
        return top_factors;
    }

    public void setTop_factors(List<String> top_factors) {
        this.top_factors = top_factors;
    }
}
