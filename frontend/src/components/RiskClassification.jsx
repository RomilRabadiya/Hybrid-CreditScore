import React from 'react';
import { motion } from 'framer-motion';
import '../styles/RiskClassification.css';

const RiskClassification = () => {
    const mainFeatures = [
        { name: "PD Estimation", importance: "54%", color: "#10b981" },
        { name: "Expense Ratio", importance: "17%", color: "#34d399" },
        { name: "EMI Ratio", importance: "12%", color: "#6ee7b7" },
        { name: "Anomaly Flag", importance: "2%", color: "#a7f3d0" }
    ];

    const riskTiers = [
        { label: "LOW", color: "#059669", desc: "Prime Tier - Elite credit stability" },
        { label: "MEDIUM", color: "#d97706", desc: "Neutral Tier - Standard monitoring" },
        { label: "HIGH", color: "#dc2626", desc: "Sub-prime Tier - Critical risk signal" }
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="risk-model-premium-section"
        >
            <div className="risk-premium-card">
                {/* Stage Header */}
                <div className="risk-header">
                    <div className="algo-meta">
                        <div className="algo-icon-emerald">🌲</div>
                        <div>
                            <h2 className="algo-title-text">Random Forest Classifier</h2>
                            <span className="algo-subtitle">Terminal Risk Decision Engine</span>
                        </div>
                    </div>
                    <div className="perf-metric-bubble-emerald">
                        <span className="m-label">Accuracy</span>
                        <span className="m-value">98.53%</span>
                    </div>
                </div>

                <div className="risk-layout-grid">
                    <div className="risk-info-pillar">
                        <div className="ml-card-content-premium">
                            <div className="ml-info-block">
                                <h4 className="ml-content-label">Hybrid Decision Logic</h4>
                                <p className="ml-desc-text">
                                    The final stage fuses unsupervised anomaly signals and supervised PD estimations into a definitive Risk Tier.
                                    300 decision trees analyze behavioral consistency to output the final credit verdict.
                                </p>
                            </div>
                        </div>

                        <div className="industrial-flow-visual">
                            <div className="flow-column inputs">
                                <h4 className="flow-label">Weighted Signals</h4>
                                <div className="weighted-stack">
                                    {mainFeatures.map((f, i) => (
                                        <div key={f.name} className="weight-row">
                                            <span className="w-name">{f.name}</span>
                                            <div className="w-bar-bg">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: f.importance }}
                                                    transition={{ duration: 1, delay: i * 0.1 }}
                                                    className="w-bar-fill"
                                                    style={{ backgroundColor: f.color }}
                                                />
                                            </div>
                                            <span className="w-val">{f.importance}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flow-column bridge">
                                <svg className="flow-connector" viewBox="0 0 300 200">
                                    <path d="M10,40 Q150,100 290,100" className="path-stroke-emerald" />
                                    <path d="M10,70 Q150,100 290,100" className="path-stroke-emerald" />
                                    <path d="M10,100 Q150,100 290,100" className="path-stroke-emerald" />
                                    <path d="M10,130 Q150,100 290,100" className="path-stroke-emerald" />
                                </svg>
                            </div>

                            <div className="flow-column engine">
                                <div className="engine-node-emerald">
                                    <span className="engine-main">Risk Label</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="risk-logic-pillar">
                        <div className="ml-card-content-premium">
                            <h4 className="ml-content-label">Outcome Classification</h4>
                            <div className="tier-stack">
                                {riskTiers.map((tier) => (
                                    <div key={tier.label} className="tier-card">
                                        <div className="tier-indicator" style={{ backgroundColor: tier.color }} />
                                        <div className="tier-content">
                                            <span className="tier-label">{tier.label}</span>
                                            <p className="tier-desc">{tier.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="performance-summary-grid">
                            <div className="perf-summary-card">
                                <div className="confidence-header">
                                    <span className="p-label">Accuracy :</span>
                                    <span className="p-val">98.53%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default RiskClassification;
