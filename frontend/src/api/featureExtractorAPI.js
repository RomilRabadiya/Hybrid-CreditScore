import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

// Calls POST /feature-extractor/extract/bank-transactions
// Input  : List<BankTransaction> (array of transaction objects)
// Output : BankStatementAnalysis (7 ML features)
export const extractFeatures = async (transactions) => {
    const response = await axios.post(
        `${API_BASE_URL}/feature-extractor/extract/bank-transactions`,
        transactions
    );
    return response.data;
};
