package bank.bankStatement.CreditScore.Controller;

import bank.bankStatement.CreditScore.MLFeatureAccumulator.BankStatementAnalysis;
import bank.bankStatement.CreditScore.MlAPICall.MlApiService;
import bank.bankStatement.CreditScore.MlAPICall.MlResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/ml")
public class MlApiController {

    private final MlApiService mlApiService;

    public MlApiController(MlApiService mlApiService) {
        this.mlApiService = mlApiService;
    }

    @PostMapping("/credit-decision")
    public ResponseEntity<MlResponse> getCreditDecision(
            @RequestBody BankStatementAnalysis request
    )
    {
        MlResponse response = mlApiService.getCreditDecision(request);

        if (response == null) {
            return ResponseEntity.internalServerError().build();
        }

        return ResponseEntity.ok(response);
    }
}
