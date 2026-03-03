package bank.bankStatement.CreditScore.MlAPICall.SupportClass;

import java.util.List;

public class PDResponse 
{
    private double Probability_of_Default;
    private List<String> top_factors;

    public double getProbability_of_Default() {
        return Probability_of_Default;
    }

    public void setProbability_of_Default(double probability_of_Default) {
        Probability_of_Default = probability_of_Default;
    }

    public List<String> getTop_factors() {
        return top_factors;
    }

    public void setTop_factors(List<String> top_factors) {
        this.top_factors = top_factors;
    }

    public PDResponse(double probability_of_Default, List<String> top_factors) {
        Probability_of_Default = probability_of_Default;
        this.top_factors = top_factors;
    }

    public PDResponse() {}
}
