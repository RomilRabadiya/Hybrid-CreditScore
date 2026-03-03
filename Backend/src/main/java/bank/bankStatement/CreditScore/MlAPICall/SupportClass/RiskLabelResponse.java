package bank.bankStatement.CreditScore.MlAPICall.SupportClass;

import java.util.List;

public class RiskLabelResponse {
    private String Risk_Label;
    private List<String> Drivers;

    public RiskLabelResponse() {}

    public String getRisk_Label() {
        return Risk_Label;
    }

    public void setRisk_Label(String risk_Label) {
        Risk_Label = risk_Label;
    }

    public List<String> getDrivers() {
        return Drivers;
    }

    public RiskLabelResponse(String risk_Label, List<String> drivers) {
        Risk_Label = risk_Label;
        Drivers = drivers;
    }

    public void setDrivers(List<String> drivers) {
        Drivers = drivers;
    }
}
