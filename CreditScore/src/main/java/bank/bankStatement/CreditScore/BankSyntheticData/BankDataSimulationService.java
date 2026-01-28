package bank.bankStatement.CreditScore.BankSyntheticData;

import bank.bankStatement.CreditScore.BankTransactionEntity.BankTransaction;
import bank.bankStatement.CreditScore.BankTransactionEntity.TransactionChannel;
import bank.bankStatement.CreditScore.BankTransactionEntity.TransactionDirection;
import bank.bankStatement.CreditScore.BankTransactionEntity.TransactionNature;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Random;

//Stream : 
// No list stored
//No bulk memory
//Stream is created only when needed
import java.util.stream.Stream;

@Service
public class BankDataSimulationService {

    private final RiskProfileBehaviorModel behaviorModel;
    private final BankTransactionFactory txnFactory;

    public BankDataSimulationService(RiskProfileBehaviorModel behaviorModel, BankTransactionFactory txnFactory) {
        this.behaviorModel = behaviorModel;
        this.txnFactory = txnFactory;
    }

    //Generates a stream of bank transactions for one year ending at the given date (or starting from).
    //The snippet implies starting from `startDate` and going for 365 days.
    
    //return A Stream of BankTransaction objects.
    
    public Stream<BankTransaction> generateOneYearStatement(String pan, String accountId, LocalDate startDate) 
    {
        // Resolve Risk Profile based on PAN
        //Maps a PAN number → financial personality
        RiskProfile profile = behaviorModel.resolveProfile(pan);

        //Random Number Generator based on PAN hash
        //Same PAN will generate same Random Number
        Random rng = new Random(pan.hashCode());

        // Initialize Balance (Mutable wrapper for use in Stream)
        BalanceBox balance = new BalanceBox(behaviorModel.initialBalance(profile, rng));

        //This Mean that we are generating transactions for 365 days
        //In One Day we are generating transactions for that day
        return Stream.iterate(startDate, d -> d.plusDays(1))
                .limit(365)
                //FlatMap is used to flatten the 
                /*stream of streams into a single stream*/
                
                //This is used to generate transactions(One or More) for each day
                .flatMap(date ->

                        //Calling generateDailyTransactions method to generate transactions for each day
                        generateDailyTransactions
                        (
                            pan, accountId, date, profile, rng, balance
                        )
                );
    }


    //Generates transactions for a specific day.
    private Stream<BankTransaction> generateDailyTransactions(
            String pan,
            String accountId,
            LocalDate date,
            RiskProfile profile,
            Random rng,
            BalanceBox balance
    ) 
    {
        Stream.Builder<BankTransaction> stream = Stream.builder();

        //Owner Monthly Income on 1st of the month => Monthly Income based on profile
        if (date.getDayOfMonth() == 1) 
        {
            //monthlyIncome is a method that returns the monthly income based on the profile
            BigDecimal income = behaviorModel.monthlyIncome(profile, rng);
            
            //Realstic Bank Transaction And add to the stream
            stream.add(
                txnFactory.create(
                    accountId, date,
                    TransactionDirection.INFLOW,//Money Income
                    TransactionNature.SALARY,//Salary Because of Monthly Income
                    TransactionChannel.NEFT,
                    income,
                    balance.value,
                    "Monthly Income"
                )
            );
            balance.value = balance.value.add(income);
        }

        //EMI Payment on 10th of the month => EMI Payment based on profile
        if (date.getDayOfMonth() == 10) 
        {
            //emiAmount is a method that returns the EMI amount based on the profile
            BigDecimal emi = behaviorModel.emiAmount(profile, rng);
            
            //Check if the balance is sufficient to pay the EMI
            if (balance.value.compareTo(emi) >= 0) 
            {
                stream.add(txnFactory.create(
                        accountId, date,
                        TransactionDirection.OUTFLOW,
                        TransactionNature.EMI,
                        TransactionChannel.INTERNAL,
                        emi,
                        balance.value,
                        "Loan EMI"
                ));
                balance.value = balance.value.subtract(emi);
            } 
            else 
            {
                // Bounce Scenario
                stream.add(txnFactory.create(
                        accountId, date,
                        TransactionDirection.OUTFLOW,
                        TransactionNature.BANK_CHARGES,//Bank Charges Because of Bounce
                        TransactionChannel.INTERNAL,
                        BigDecimal.valueOf(500),//Bank Charges Amount
                        balance.value,
                        "EMI Bounce Charge"
                ));
                balance.value = balance.value.subtract(BigDecimal.valueOf(500));
            }
        }

        //Daily Expenses => spending on daily basis base on profile

        //dailyTxnCount is a method that returns the number of daily transactions based on the profile
        int count = behaviorModel.dailyTxnCount(profile, rng);
        
        for (int i = 0; i < count; i++) 
        {

            //randomExpense is a method that returns a random expense based on the profile
            BigDecimal spend = behaviorModel.randomExpense(profile, rng);

            // Stop spending if balance is insufficient
            if (balance.value.compareTo(spend) <= 0) break;

            stream.add
            (
                txnFactory.create( 
                    accountId, date,
                    TransactionDirection.OUTFLOW,
                    TransactionNature.UPI_TRANSFER,
                    TransactionChannel.UPI,
                    spend,
                    balance.value,
                    "Daily Expense"
                )
            );
            balance.value = balance.value.subtract(spend);
        }

        return stream.build();
    }

    //Mutable wrapper for BigDecimal to use within Lambdas/Streams.
    private static final class BalanceBox {
        BigDecimal value;
        BalanceBox(BigDecimal value) {
            this.value = value;
        }
    }
}
