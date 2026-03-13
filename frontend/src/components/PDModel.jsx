import React from 'react';
import { motion } from 'framer-motion';
import '../styles/PDModel.css';

const PDModel = () => {
    const features = [
        "avgMonthlyIncome", "emiRatio", "expenseRatio",
        "bounceCount", "accountAgeMonths"
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="pd-model-premium-section"
        >
            <div className="pd-premium-card">
                {/* User Requested: Description at Top */}
                <div className="pd-business-context">
                    <div className="context-header">
                        <h3 className="context-title">What Banks Really Care About</h3>
                    </div>
                    <div className="context-grid">
                        <div className="context-text-block">
                            <p>
                                Banks must know: <strong>"How many customers are expected to default?"</strong> – not just who is better than whom.
                                That is why PD (Probability of Default) is mandatory in real banking systems.
                            </p>
                            <div className="pd-definition-box">
                                <h5 className="def-label">What is PD?</h5>
                                <p className="def-text">
                                    Probability of Default is the likelihood that a borrower will fail to repay a loan within a given period.
                                    <em> e.g., A 5% PD means that out of 100 similar customers, 5 are expected to default.</em>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pd-header">
                    <div className="algo-meta">
                        <div className="algo-icon">📉</div>
                        <div>
                            <h2 className="algo-title-text">Logistic Regression</h2>
                            <span className="algo-subtitle">Supervised PD Engine</span>
                        </div>
                    </div>
                </div>

                <div className="pd-layout-grid">
                    <div className="pd-info-pillar">
                        <div className="ml-card-content-premium">
                            <div className="ml-info-block">
                                <h4 className="ml-content-label">Model Methodology</h4>
                                <p className="ml-desc-text">
                                    A supervised classification model that estimates the probability of default based on behavioral stress signals.
                                    Unlike ranking algorithms, it outputs a calibrated 0-1 probability.
                                </p>
                            </div>
                        </div>

                        <div className="industrial-flow-visual">
                            <div className="flow-column inputs">
                                <h4 className="flow-label">Feature Input Space</h4>
                                <div className="feature-nodes-stack">
                                    {features.map((f, i) => (
                                        <motion.div
                                            key={f}
                                            initial={{ x: -10, opacity: 0 }}
                                            whileInView={{ x: 0, opacity: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="feature-tag-pill"
                                        >
                                            {f}
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <div className="flow-column bridge">
                                <svg className="flow-connector" viewBox="0 0 300 200">
                                    <path d="M10,40 Q150,100 290,100" className="path-stroke-gold" />
                                    <path d="M10,70 Q150,100 290,100" className="path-stroke-gold" />
                                    <path d="M10,100 Q150,100 290,100" className="path-stroke-gold" />
                                    <path d="M10,130 Q150,100 290,100" className="path-stroke-gold" />
                                    <path d="M10,160 Q150,100 290,100" className="path-stroke-gold" />
                                </svg>
                            </div>

                            <div className="flow-column engine">
                                <div className="engine-node-gold">
                                    <span className="engine-main">Probability of Default</span>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pd-logic-pillar">

                        <div className="performance-summary-grid">
                            <div className="perf-summary-card">
                                <span className="p-label">Accuracy</span>
                                <span className="p-val">88.95%</span>
                            </div>
                            <div className="perf-summary-card highlight-gold">
                                <span className="p-label">Recall</span>
                                <span className="p-val">90.72%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default PDModel;
