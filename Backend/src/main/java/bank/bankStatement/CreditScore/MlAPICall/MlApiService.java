package bank.bankStatement.CreditScore.MlAPICall;

import bank.bankStatement.CreditScore.MLFeatureAccumulator.BankStatementAnalysis;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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

    public String getCreditDecision(BankStatementAnalysis request)
    {

        String url = mlApiBaseUrl + CREDIT_DECISION_PATH;

        // Setting the headers for the request
        HttpHeaders headers = new HttpHeaders();
        // Setting the content type to JSON
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Creating the HTTP entity
        HttpEntity<BankStatementAnalysis> httpEntity = new HttpEntity<>(request, headers);

        try 
        {
            ResponseEntity<String> response = restTemplate.postForEntity(
                    url,
                    httpEntity,
                    String.class
            );

            System.out.println(response.getBody());
            
            // MlResponse response = restTemplate.postForObject(
            //         url,
            //         httpEntity,
            //         MlResponse.class
            // );

            // if (response == null) {
            //     throw new Exception();
            // }

            return response.getBody();

        } 
        catch (Exception e) 
        {
            System.out.println(e.getMessage());
        }

        return null;
    }
}
