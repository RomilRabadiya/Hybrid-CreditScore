import React from 'react';
import { motion } from 'framer-motion';
import '../styles/SystemArchitecture.css';

const SystemArchitecture = () => {
    const panNumber = "ABCD 1234 A";

    const transactions = [
        { date: "2025-03-08", nature: "UPI_TRANSFER", amount: "-2230", balance: "155299", direction: "OUTFLOW" },
        { date: "2025-03-08", nature: "UPI_TRANSFER", amount: "-1932", balance: "153367", direction: "OUTFLOW" },
        { date: "2025-03-08", nature: "UPI_TRANSFER", amount: "-1060", balance: "152307", direction: "OUTFLOW" },
        { date: "2025-03-09", nature: "UPI_TRANSFER", amount: "-2866", balance: "149441", direction: "OUTFLOW" },
        { date: "2025-03-09", nature: "UPI_TRANSFER", amount: "-1210", balance: "148231", direction: "OUTFLOW" },
        { date: "2025-03-09", nature: "UPI_TRANSFER", amount: "-2519", balance: "145712", direction: "OUTFLOW" },
        { date: "2025-03-10", nature: "EMI", amount: "-30000", balance: "112909", direction: "OUTFLOW" },
    ];

    const features = [
        {
            id: "avgMonthlyIncome",
            label: "INCOME (AVG)",
            value: "201176.83",
            icon: "💰",
            description: "Average monthly cash inflow from salary/business",
            formula: "totalCredits / months",
            insight: "Measures repayment capacity",
            impact: "High avgMonthlyIncome → Higher Score",
            impactType: "positive"
        },
        {
            id: "incomeCV",
            label: "INCOME STABILITY (CV)",
            value: "0.0498",
            icon: "📈",
            description: "Income volatility indicator",
            formula: "std(income) / mean(income)",
            insight: "Stable income means lower default risk",
            impact: "Lower CV → Higher Score",
            impactType: "positive"
        },
        {
            id: "expenseRatio",
            label: "Expense Ratio",
            value: "85.2%",
            icon: "📉",
            description: "Proportion of income spent monthly",
            formula: "totalDebits / income",
            insight: "High expenses indicate financial pressure",
            impact: "Lower ratio → Higher Score",
            impactType: "positive"
        },
        {
            id: "emiRatio",
            label: "EMI Ratio",
            value: "14.9%",
            icon: "💳",
            description: "Portion of income used for loan repayments",
            formula: "EMI / income",
            insight: "Indicates leverage risk",
            impact: "Higher ratio → Lower Score",
            impactType: "negative"
        },
        {
            id: "avgMonthlyBalance",
            label: "Average Monthly Balance",
            value: "98709.86",
            icon: "🏦",
            description: "Average remaining account balance",
            formula: "mean(monthlyBalance)",
            insight: "Shows emergency cash cushion",
            impact: "Higher balance → Higher Score",
            impactType: "positive"
        },
        {
            id: "bounceCount",
            label: "Bounce Count",
            value: "0",
            icon: "⚠️",
            description: "Number of payment failures",
            formula: "failedTransactions",
            insight: "Strong indicator of repayment discipline",
            impact: "More bounces → Lower Score",
            impactType: "negative"
        },
        {
            id: "accountAgeMonths",
            label: "Account Age (Months)",
            value: "11",
            icon: "⏳",
            description: "Age of banking relationship",
            formula: "monthsSinceAccountOpen",
            insight: "Mature accounts indicate financial stability",
            impact: "Older accounts → Higher Score",
            impactType: "positive"
        },
    ];


    return (
        <div className="page-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="architecture-header"
            >
                <h1 className="text-gradient">System Design Architecture</h1>
                <p className="subtitle">Visualizing the Hybrid Credit Scoring Pipeline</p>
            </motion.div>

            <div className="architecture-flow">
                {/* Section 1: Data Acquisition */}
                <div className="architecture-section">

                    <div className="flow-container">
                        {/* PAN Identification */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="pan-card-visual"
                        >
                            <div className="card-label">PAN IDENTIFICATION</div>
                            <div className="pan-number">{panNumber}</div>
                        </motion.div>

                        <div className="connector">
                            <div className="arrow-down"></div>
                            <div className="connector-label">FETCH BANK STATEMENT</div>
                            <div className="arrow-down"></div>
                        </div>

                        {/* Bank Statement */}
                        <div className="statement-visual">
                            <div className="card-label">BANK STATEMENT (RAW DATA)</div>
                            <div className="mini-table-container">
                                <table className="mini-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Nature</th>
                                            <th>Amount</th>
                                            <th>Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((tx, i) => (
                                            <tr key={i}>
                                                <td>{tx.date}</td>
                                                <td><span className="tag">{tx.nature}</span></td>
                                                <td className="amount negative">{tx.amount}</td>
                                                <td>{tx.balance}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="connector">
                            <div className="arrow-down"></div>
                            <div className="connector-label">FEATURE EXTRACTOR</div>
                            <div className="arrow-down"></div>
                        </div>

                        {/* Feature Extraction Results */}
                        <div className="features-visual">
                            <div className="card-label">EXTRACTED FINANCIAL SIGNALS</div>
                            <div className="feature-grid-expanded">
                                {features.map((f, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5 }}
                                        className="feature-card-expanded"
                                    >
                                        <div className="feature-card-head">
                                            <div className="f-icon">{f.icon}</div>
                                        </div>

                                        <div className="f-main-value">
                                            <div className="f-label">{f.label}</div>
                                            <div className="f-value text-gradient">{f.value}</div>
                                        </div>

                                        <div className="f-details">
                                            <div className="f-detail-item">
                                                <span className="f-detail-label">Description</span>
                                                <span className="f-detail-text">{f.description}</span>
                                            </div>
                                            <div className="f-detail-item">
                                                <span className="f-detail-label">Formula / Logic</span>
                                                <code className="f-detail-code">{f.formula}</code>
                                            </div>
                                            <div className="f-detail-item">
                                                <span className="f-detail-label">Risk Insight</span>
                                                <span className="f-detail-text">{f.insight}</span>
                                            </div>
                                            <div className="f-detail-item">
                                                <span className="f-detail-label">Score Impact</span>
                                                <span className={`f-impact-badge ${f.impactType}`}>
                                                    {f.impact}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SystemArchitecture;
