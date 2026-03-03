package bank.bankStatement.CreditScore.Controller;

import bank.bankStatement.CreditScore.BankTransactionEntity.BankTransaction;
import bank.bankStatement.CreditScore.MLFeatureAccumulator.BankStatementAnalysis;
import bank.bankStatement.CreditScore.MLFeatureAccumulator.FeatureExtractorService;
import bank.bankStatement.CreditScore.BankSyntheticData.BankStatementGeneratorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Stream;

// REST Controller for FeatureExtractorService
@RestController
@RequestMapping("/feature-extractor")
public class FeatureExtractorController {

    private final FeatureExtractorService featureExtractorService;

    public FeatureExtractorController(
            FeatureExtractorService featureExtractorService
    ) {
        this.featureExtractorService = featureExtractorService;
    }

    @PostMapping("/extract/bank-transactions")
    public ResponseEntity<BankStatementAnalysis> extractFeaturesFromTransactions(
            @RequestBody List<BankTransaction> transactions
    ) {
        Stream<BankTransaction> transactionStream = transactions.stream();

        BankStatementAnalysis analysis = featureExtractorService.extract(transactionStream);

        return ResponseEntity.ok(analysis);
    }
}
