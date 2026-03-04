import axios from "axios";

const API_BASE_URL = "http://localhost:8080/explain";

// Calls POST /explain/{type}
// Input  : BankStatementAnalysis (7 ML features object)
// Output : PNG bytes
export const getVisualization = async (type, analysis) => {
    const response = await axios.post(`${API_BASE_URL}/${type}`, analysis, {
        responseType: "blob"
    });
    return response.data;
};