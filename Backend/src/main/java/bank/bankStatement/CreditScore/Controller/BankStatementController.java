package bank.bankStatement.CreditScore.Controller;

import bank.bankStatement.CreditScore.BankSyntheticData.BankStatementCsvService;
import bank.bankStatement.CreditScore.BankSyntheticData.BankStatementGeneratorService;
import bank.bankStatement.CreditScore.BankTransactionEntity.BankTransaction;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

// REST Controller for BankStatementGeneratorService

// Request By Frontend
// Response To Frontend
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/bank-statement")
public class BankStatementController {

    private final BankStatementCsvService runtimeService;
    private final BankStatementGeneratorService bankStatementGeneratorService;

    public BankStatementController(BankStatementCsvService runtimeService , BankStatementGeneratorService bankStatementGeneratorService) {
        this.runtimeService = runtimeService;
        this.bankStatementGeneratorService = bankStatementGeneratorService;
    }

    // Generate a 1-year synthetic bank statement.
    @GetMapping("/generate")
    public ResponseEntity<List<BankTransaction>> generateStatement(
            @RequestParam String pan,
            @RequestParam String accountId
    ) 
    {
        // Default: start from one year ago from today
        LocalDate startDate = LocalDate.now().minusYears(1);

        Stream<BankTransaction> transactionStream =
                bankStatementGeneratorService.generateOneYearStatement(pan, accountId, startDate);

        List<BankTransaction> transactions = transactionStream.collect(Collectors.toList());

        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/generateCsv")
    public String generateCsvStatement(@RequestParam String pan,
            @RequestParam String accountId) {

        return runtimeService.generateCsv(
                pan,
                accountId,
                LocalDate.now().minusYears(1)
        );
    }
}
