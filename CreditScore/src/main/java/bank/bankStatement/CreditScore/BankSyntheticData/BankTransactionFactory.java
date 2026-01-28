package bank.bankStatement.CreditScore.BankSyntheticData;

import bank.bankStatement.CreditScore.BankTransactionEntity.BankTransaction;
import bank.bankStatement.CreditScore.BankTransactionEntity.TransactionChannel;
import bank.bankStatement.CreditScore.BankTransactionEntity.TransactionDirection;
import bank.bankStatement.CreditScore.BankTransactionEntity.TransactionNature;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
public class BankTransactionFactory {

    //Factory method for creating BankTransaction
    public BankTransaction create(
            String accountId,
            LocalDate date,
            TransactionDirection direction,
            TransactionNature nature,
            TransactionChannel channel,
            BigDecimal amount,
            BigDecimal balanceBefore,
            String description
    ) 
    {
        // Note: 'pan' is used for logic but not stored in BankTransaction entity currently.
        return new BankTransaction(
                accountId,
                date,
                direction,
                nature,
                channel,
                amount,
                balanceBefore,
                description
        );
    }
}
