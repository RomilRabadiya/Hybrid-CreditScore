package bank.bankStatement.CreditScore.Controller;

import bank.bankStatement.CreditScore.MLFeatureAccumulator.BankStatementAnalysis;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

// REST Controller for visualizes_decision.py

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/explain")
public class VisualizationController {

    @Value("${ml.base-url}")
    private String mlApiBaseUrl;

    private final RestTemplate restTemplate;

    public VisualizationController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }


    // Forwards request to FastAPI explain endpoint and returns PNG bytes
    private ResponseEntity<byte[]> forwardToExplainEndpoint(
            String path,
            BankStatementAnalysis request
    ) 
    {
        String url = mlApiBaseUrl + "/api/explain" + path;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<BankStatementAnalysis> httpEntity = new HttpEntity<>(request, headers);

        try {
            ResponseEntity<byte[]> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    httpEntity,
                    byte[].class
            );

            // Return PNG bytes with correct Content-Type

            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(response.getBody());

        } catch (Exception e) {
            System.err.println("[VisualizationController] Error calling " + path + ": " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }


    // POST /explain/pd
    @PostMapping("/pd")
    public ResponseEntity<byte[]> explainPD(
            @RequestBody BankStatementAnalysis request
    ) 
    {
        return forwardToExplainEndpoint("/pd", request);
    }


    // POST /explain/anomaly
    @PostMapping("/anomaly")
    public ResponseEntity<byte[]> explainAnomaly(
            @RequestBody BankStatementAnalysis request
    ) {
        return forwardToExplainEndpoint("/anomaly", request);
    }


    // POST /explain/hybrid
    @PostMapping("/hybrid")
    public ResponseEntity<byte[]> explainHybrid(
            @RequestBody BankStatementAnalysis request
    ) {
        return forwardToExplainEndpoint("/hybrid", request);
    }


    // POST /explain/risk
    @PostMapping("/risk")
    public ResponseEntity<byte[]> explainRisk(
            @RequestBody BankStatementAnalysis request
    ) {
        return forwardToExplainEndpoint("/risk", request);
    }

}
