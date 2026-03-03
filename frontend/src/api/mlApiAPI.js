import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

// Calls POST /ml/credit-decision
// Input  : BankStatementAnalysis (7 ML features object)
// Output : MlResponse { PD, Anomaly, RiskLabel, HybridScore, RL_Recommendation }
export const getCreditDecision = async (analysis) => {
    const response = await axios.post(
        `${API_BASE_URL}/ml/credit-decision`,
        analysis
    );
    return response.data;
};
