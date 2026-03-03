package bank.bankStatement.CreditScore.MLFeatureAccumulator;

import bank.bankStatement.CreditScore.BankTransactionEntity.BankTransaction;
import org.springframework.stereotype.Service;

import java.util.stream.Stream;

@Service
public class FeatureExtractorService 
{
    public BankStatementAnalysis extract(Stream<BankTransaction> transactions)
    {
        // Create a FRESH accumulator for each call (stateful, not reusable)
        FeatureAccumulator accumulator = new FeatureAccumulator();

        // Feed every transaction Add the accumulator
        transactions.forEach(transaction -> {
            accumulator.addTransaction(transaction);
        });

        // Compute and return the final ML feature set
        return accumulator.toAnalysis();
    }
}
