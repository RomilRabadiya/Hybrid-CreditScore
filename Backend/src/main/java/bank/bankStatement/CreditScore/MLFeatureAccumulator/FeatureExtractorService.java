package bank.bankStatement.CreditScore.MLFeatureAccumulator;

import bank.bankStatement.CreditScore.BankTransactionEntity.BankTransaction;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;

@Service
public class FeatureExtractorService
{
    private final FeatureAccumulator featureAccumulator =
            new FeatureAccumulator();

    /**
     * Bank Transactions
     *      ↓
     * FeatureAccumulator
     *      ↓
     * BankStatementAnalysis
     */
    public BankStatementAnalysis extract(Stream<BankTransaction> transactions)
    {
        List<BankTransaction> transactionList =
                transactions.toList();

        return featureAccumulator.analyze(transactionList);
    }
}
