package bank.bankStatement.CreditScore.BankTransactionEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public final class BankTransaction {

    /* =========================
       Core Identifiers
       ========================= */
    private final String transactionId;
    private final String accountId;

    /* =========================
       Transaction Metadata
       ========================= */
    private final LocalDate transactionDate;
    private final TransactionDirection direction;   // INFLOW / OUTFLOW
    private final TransactionNature nature;         // SALARY, EMI, RENT
    private final TransactionChannel channel;       // UPI, NEFT, CASH

    /* =========================
       Financials
       ========================= */
    private final BigDecimal amount;
    private final BigDecimal balanceBefore;
    private final BigDecimal balanceAfter;

    /* =========================
       Description
       ========================= */
    private final String description;

    /* =========================
       Constructor
       ========================= */
    public BankTransaction(
            String accountId,
            LocalDate transactionDate,
            TransactionDirection direction,
            TransactionNature nature,
            TransactionChannel channel,
            BigDecimal amount,
            BigDecimal balanceBefore,
            String description
    ) {
        this.transactionId = UUID.randomUUID().toString();
        this.accountId = accountId;
        this.transactionDate = transactionDate;
        this.direction = direction;
        this.nature = nature;
        this.channel = channel;
        this.amount = amount;
        this.balanceBefore = balanceBefore;
        this.description = description;

        // ✅ Safe balance calculation
        this.balanceAfter = direction == TransactionDirection.INFLOW
                ? balanceBefore.add(amount)
                : balanceBefore.subtract(amount);
    }

    /* =========================
       Getters (Immutable Object)
       ========================= */
    public String getTransactionId() { return transactionId; }
    public String getAccountId() { return accountId; }
    public LocalDate getTransactionDate() { return transactionDate; }
    public TransactionDirection getDirection() { return direction; }
    public TransactionNature getNature() { return nature; }
    public TransactionChannel getChannel() { return channel; }
    public BigDecimal getAmount() { return amount; }
    public BigDecimal getBalanceBefore() { return balanceBefore; }
    public BigDecimal getBalanceAfter() { return balanceAfter; }
    public String getDescription() { return description; }
}
