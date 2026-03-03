//axios is feature of node.js that is used to make HTTP requests from node.js
//we can use axios to make API requests to our backend server
import axios from "axios";

// Base URL of the Spring Boot server
const API_BASE_URL = "http://localhost:8080"; // your Spring Boot


// Function to generate bank statement
// Parameters : pan and accountId
// Response : List of BankTransaction
export const generateBankStatement = async (pan, accountId) => {
    // Calling the Spring Boot API to generate the bank statement URL : http://localhost:8080/bank-statement/generate
    const response = await axios.get(
                `${API_BASE_URL}/bank-statement/generate`,
                {
                params: { pan, accountId }
                }
        );
    
    // Return the response data
    return response.data;
};