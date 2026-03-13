import React from 'react';
import { motion } from 'framer-motion';
import '../styles/AnomalyDetection.css';

const AnomalyDetection = () => {
    const features = [
        "avgMonthlyIncome", "incomeCV", "expenseRatio",
        "emiRatio", "avgMonthlyBalance", "bounceCount"
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="anomaly-detection-premium-section"
        >
            <div className="anomaly-premium-card">
                <div className="anomaly-header">
                    <div className="algo-meta">
                        <div className="algo-icon">🔍</div>
                        <div>
                            <h2 className="algo-title-text">Isolation Forest</h2>
                            <span className="algo-subtitle">Unsupervised Learning</span>
                        </div>
                    </div>
                </div>

                <div className="anomaly-layout-grid">
                    <div className="anomaly-info-pillar">
                        <div className="ml-card-content-premium">
                            <div className="ml-info-block">
                                <h4 className="ml-content-label">Model Description</h4>
                                <p className="ml-desc-text">
                                    Unsupervised model that isolates outliers by randomly selecting a feature and then randomly selecting a split value between the maximum and minimum values of the selected feature.
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
                                    <path d="M10,40 Q150,100 290,100" className="path-stroke" />
                                    <path d="M10,70 Q150,100 290,100" className="path-stroke" />
                                    <path d="M10,100 Q150,100 290,100" className="path-stroke" />
                                    <path d="M10,130 Q150,100 290,100" className="path-stroke" />
                                    <path d="M10,160 Q150,100 290,100" className="path-stroke" />
                                </svg>
                            </div>

                            <div className="flow-column engine">
                                <div className="engine-node">
                                    <span className="engine-main">Anomaly Score</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="anomaly-logic-pillar">
                        <div className="logic-execution-card">
                            <h4 className="ml-content-label">Decision Boundary</h4>
                            <div className="logic-display">
                                <div className="logic-line">
                                    <span className="label">Boundary</span>
                                    <code>score &lt; 0.00</code>
                                </div>
                                <div className="logic-dir">↓</div>
                                <div className="logic-outcome error">
                                    <span className="label">Classification</span>
                                    <span className="val">Anomaly Flagged</span>
                                </div>
                            </div>
                            <p className="logic-note">Calculated @ 3rd Percentile</p>
                        </div>

                        <div className="performance-summary-grid">
                            <div className="perf-summary-card">
                                <span className="p-label">False Positive Rate</span>
                                <span className="p-val">3.46%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default AnomalyDetection;
