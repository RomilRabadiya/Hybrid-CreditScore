package bank.bankStatement.CreditScore.MlAPICall;

import bank.bankStatement.CreditScore.MLFeatureAccumulator.BankStatementAnalysis;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MlApiService
{

    @Value("${ml.base-url}")
    private String mlApiBaseUrl;

    private static final String CREDIT_DECISION_PATH = "/api/credit/decision";

    // RestTemplate Reference : https://www.geeksforgeeks.org/springboot/spring-resttemplate/
    private final RestTemplate restTemplate;

    public MlApiService(RestTemplate restTemplate)
    {
        this.restTemplate = restTemplate;
    }

    public MlResponse getCreditDecision(BankStatementAnalysis request)
    {
        String url = mlApiBaseUrl + CREDIT_DECISION_PATH;

        // Setting Content-Type: application/json header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Wrap request body + headers into HttpEntity
        HttpEntity<BankStatementAnalysis> httpEntity = new HttpEntity<>(request, headers);

        try
        {
            // Call FastAPI ML engine and deserialize response into MlResponse

            // MIMP : JSON Object To Java Object 
            // For this we need to use @JsonProperty annotation in the MlResponse class
            // @JsonProperty is used to map JSON object to Java object
            // API-CreditDecisionEngine returns JSON object and we are deserializing it into MlResponse class
            
            MlResponse response = restTemplate.postForObject(
                    url,
                    httpEntity,
                    MlResponse.class
            );

            if (response == null)
            {
                throw new RuntimeException("ML API returned null response");
            }

            return response;
        }
        catch (Exception e)
        {
            System.err.println("[MlApiService] Error calling ML API: " + e.getMessage());
        }

        return null;
    }
}
