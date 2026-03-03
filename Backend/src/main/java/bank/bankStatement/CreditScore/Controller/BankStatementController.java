package bank.bankStatement.CreditScore.Controller;

import bank.bankStatement.CreditScore.BankTransactionEntity.BankTransaction;
import bank.bankStatement.CreditScore.BankSyntheticData.BankStatementGeneratorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

// REST Controller for BankStatementGeneratorService
@RestController
@RequestMapping("/bank-statement")
public class BankStatementController {

    private final BankStatementGeneratorService bankStatementGeneratorService;

    public BankStatementController(BankStatementGeneratorService bankStatementGeneratorService) 
    {
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
}
