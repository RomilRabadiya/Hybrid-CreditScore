import React from 'react';
import { motion } from 'framer-motion';
import '../styles/HybridCreditScore.css';

const HybridCreditScore = () => {
    const fusionLogic = [
        { name: "Rule Engine Score", weight: "60%", color: "#b45309", desc: "Expert Heuristics & Policy" },
        { name: "ML Signal Score", weight: "40%", color: "#0d9488", desc: "Behavioral Deep Learning" }
    ];

    const rawFeatures = [
        "avgMonthlyIncome", "incomeCV", "expenseRatio", "emiRatio",
        "avgMonthlyBalance", "bounceCount", "accountAgeMonths"
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="hybrid-score-premium-section"
        >
            <div className="hybrid-premium-card">
                {/* Stage Header */}
                <div className="hybrid-header">
                    <div className="algo-meta">
                        <div className="algo-icon-gold">🏆</div>
                        <div>
                            <h2 className="algo-title-text-gold">Gradient Boosting Regressor</h2>
                            <span className="algo-subtitle-gold">The Terminal Decision Engine</span>
                        </div>
                    </div>
                    <div className="perf-metric-bubble-gold">
                        <span className="m-label">R² Score</span>
                        <span className="m-value">0.9482</span>
                    </div>
                </div>

                <div className="hybrid-layout-grid">
                    <div className="hybrid-info-pillar">
                        <div className="ml-card-content-premium">
                            <div className="ml-info-block">
                                <h4 className="ml-content-label">The Synthesis Engine</h4>
                                <p className="ml-desc-text">
                                    The terminal stage fusions expert rule-based logic with multi-dimensional ML signals.
                                    Gradient Boosting trees reconcile mathematical dependencies to produce a single,
                                    reliable Hybrid Credit Score.
                                </p>
                            </div>
                        </div>

                        <div className="industrial-flow-visual">
                            <div className="flow-column inputs-wide">
                                <div className="input-group">
                                    <h4 className="flow-label">Feature Input Space</h4>
                                    <div className="feature-nodes-stack-vertical">
                                        {rawFeatures.slice(0, 5).map((f, i) => (
                                            <motion.div
                                                key={f}
                                                initial={{ x: -10, opacity: 0 }}
                                                whileInView={{ x: 0, opacity: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="feature-tag-pill-industrial"
                                            >
                                                {f}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flow-divider"></div>

                                <div className="input-group">
                                    <h4 className="flow-label">Weighted Fusion</h4>
                                    <div className="weighted-stack">
                                        {fusionLogic.map((logic, i) => (
                                            <div key={logic.name} className="weight-row">
                                                <span className="w-name">{logic.name}</span>
                                                <div className="w-bar-bg">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: logic.weight }}
                                                        transition={{ duration: 1.2, delay: i * 0.2 }}
                                                        className="w-bar-fill-gold"
                                                        style={{ backgroundColor: logic.color }}
                                                    />
                                                </div>
                                                <span className="w-val">{logic.weight}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flow-column bridge">
                                <svg className="flow-connector-multi" viewBox="0 0 300 200">
                                    {/* Multi-paths from features */}
                                    <path d="M10,20 Q150,100 290,100" className="path-stroke-gold-thin" />
                                    <path d="M10,45 Q150,100 290,100" className="path-stroke-gold-thin" />
                                    <path d="M10,70 Q150,100 290,100" className="path-stroke-gold-thin" />
                                    <path d="M10,100 Q150,100 290,100" className="path-stroke-gold-thin" />
                                    <path d="M10,130 Q150,100 290,100" className="path-stroke-gold-thin" />

                                    {/* Fusion Paths */}
                                    <path d="M10,165 Q150,100 290,100" className="path-stroke-gold-solid" />
                                    <path d="M10,190 Q150,100 290,100" className="path-stroke-gold-solid" />
                                </svg>
                            </div>

                            <div className="flow-column engine">
                                <div className="engine-node-gold">
                                    <span className="engine-main">Hybrid Credit Score</span>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hybrid-logic-pillar">


                        <div className="performance-summary-grid">
                            <div className="perf-summary-card">
                                <div className="confidence-header">
                                    <span className="p-label">Accuracy :</span>
                                    <span className="p-val">95.87%</span>
                                </div>
                                <div className="regression-meta">
                                    <div className="meta-item">
                                        <span className="m-tag">MAE</span>
                                        <span className="m-num">20.40 pts</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="m-tag">RMSE</span>
                                        <span className="m-num">25.84 pts</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default HybridCreditScore;
