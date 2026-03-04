package bank.bankStatement.CreditScore.BankSyntheticData;

import bank.bankStatement.CreditScore.BankSyntheticData.BankStatementGeneratorService;
import bank.bankStatement.CreditScore.BankTransactionEntity.BankTransaction;
import org.springframework.stereotype.Service;

import java.io.StringWriter;
import java.time.LocalDate;
import java.util.stream.Stream;

@Service
public class BankStatementCsvService {

    private final BankStatementGeneratorService generatorService;

    public BankStatementCsvService(BankStatementGeneratorService generatorService) {
        this.generatorService = generatorService;
    }

    public String generateCsv(String pan, String accountId, LocalDate startDate) {

        StringWriter writer = new StringWriter();

        writer.append("Date,Direction,Nature,Amount,BalanceAfter\n");

        try (Stream<BankTransaction> stream =
                     generatorService.generateOneYearStatement(pan, accountId, startDate)) {

            stream.forEach(txn -> {
                writer.append(txn.getTransactionDate().toString()).append(",");
                writer.append(txn.getDirection().toString()).append(",");
                writer.append(txn.getNature().toString()).append(",");
                writer.append(txn.getAmount().toString()).append(",");
                writer.append(txn.getBalanceAfter().toString()).append("\n");
            });

        }

        return writer.toString();
    }
}