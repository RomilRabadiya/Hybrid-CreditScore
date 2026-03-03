package bank.bankStatement.CreditScore.MlAPICall.SupportClass;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class RiskLabelResponse
{
    @JsonProperty("Risk_Label")
    private String Risk_Label;

    @JsonProperty("Drivers")
    private List<String> Drivers;

    public RiskLabelResponse() {}

    public String getRisk_Label() { return Risk_Label; }
    public void setRisk_Label(String risk_Label) { Risk_Label = risk_Label; }

    public List<String> getDrivers() { return Drivers; }
    public void setDrivers(List<String> drivers) { Drivers = drivers; }
}
