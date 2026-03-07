import { useState } from "react";
import "../styles/BankStatement.css";

// BankStatement Component
// Responsibility : Render the transactions table with pagination

function BankStatement({ transactions }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // If no transactions, render nothing
    if (transactions.length === 0) return null;

    // Pagination Logic
    const totalPages = Math.ceil(transactions.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTransactions = transactions.slice(startIndex, startIndex + itemsPerPage);

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // Print the transactions in Table format
    return (
        <div className="bank-statement-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-soft)' }}>
                    Displaying <strong style={{ color: 'var(--text-main)' }}>{transactions.length}</strong> activity records
                </p>
                <span className="page-info">
                    Page {currentPage} of {totalPages}
                </span>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Direction</th>
                            <th>Nature</th>
                            <th>Amount</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTransactions.map((txn, index) => (
                            <tr key={index}>
                                <td style={{ fontWeight: 500 }}>{txn.transactionDate}</td>
                                <td>
                                    <span className={`direction-badge ${txn.direction === 'INFLOW' ? 'direction-inflow' : 'direction-outflow'}`}>
                                        {txn.direction.toLowerCase()}
                                    </span>
                                </td>
                                <td style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>{txn.nature}</td>
                                <td style={{ fontWeight: 600, color: txn.direction === 'INFLOW' ? '#059669' : 'var(--text-main)' }}>
                                    {txn.direction === 'INFLOW' ? '+' : '-'}{txn.amount}
                                </td>
                                <td style={{ color: 'var(--text-soft)' }}>{txn.balanceAfter}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="pagination-controls">
                <div className="pagination-buttons">
                    <button
                        className="btn"
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="btn"
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
                <span className="page-info">
                    Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, transactions.length)} of {transactions.length}
                </span>
            </div>
        </div>
    );
}

export default BankStatement;
