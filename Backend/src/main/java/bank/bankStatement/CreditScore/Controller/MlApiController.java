package bank.bankStatement.CreditScore.Controller;

import bank.bankStatement.CreditScore.MLFeatureAccumulator.BankStatementAnalysis;
import bank.bankStatement.CreditScore.MlAPICall.MlApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/ml")
public class MlApiController {

    private final MlApiService mlApiService;

    public MlApiController(MlApiService mlApiService) {
        this.mlApiService = mlApiService;
    }

    @PostMapping("/credit-decision")
    public ResponseEntity<String> getCreditDecision(
            @RequestBody BankStatementAnalysis request
    ) 
    {
        String response = mlApiService.getCreditDecision(request);

        if (response == null) {
            return ResponseEntity.internalServerError().build();
        }

        return ResponseEntity.ok(response);
    }
}
