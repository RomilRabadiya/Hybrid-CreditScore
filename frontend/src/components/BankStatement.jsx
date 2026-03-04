// BankStatement Component
// Responsibility : Render the transactions table

function BankStatement({ transactions }) {
    // If no transactions, render nothing
    if (transactions.length === 0) return null;

    // Print the transactions in Table format
    return (
        <div>
            <p>
                {transactions.length} transactions generated
            </p>

            <table border="1" cellPadding="8">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Direction</th>
                        <th>Nature</th>
                        <th>Amount</th>
                        <th>Balance After</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((txn, index) => (
                        <tr key={index}>
                            <td>{txn.transactionDate}</td>
                            <td>{txn.direction}</td>
                            <td>{txn.nature}</td>
                            <td>{txn.amount}</td>
                            <td>{txn.balanceAfter}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BankStatement;
