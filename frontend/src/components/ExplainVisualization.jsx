import React, { useState } from "react";
import { getVisualization } from "../api/visualizationAPI";
import "../styles/ExplainVisualization.css";

// analysis : Object Pass to VisualizationController in Backend
// analysis : { avgMonthlyIncome : number , incomeCV : number , expenseRatio : number , emiRatio : number , avgMonthlyBalance : number , bounceCount : number , accountAgeMonths : number }

// When We Call axios function getVisualization(type, analysis) it returns a Blob object
// Blob object is a binary data object that represents a file or a stream of data
const ExplainVisualization = ({ analysis }) => {
    // images : Array of images (PNG bytes)
    const [images, setImages] = useState({
        pd: null, // pd explaination image
        anomaly: null, // anomaly explaination image
        hybrid: null, // hybrid explaination image
        risk: null, // risk explaination image
    });

    const [loading, setLoading] = useState({});

    const fetchVisualization = async (type) => {
        if (!analysis) return;
        setLoading(prev => ({ ...prev, [type]: true }));
        try {
            // Call Backend API to get Visualization
            const blob = await getVisualization(type, analysis);
            const imageUrl = URL.createObjectURL(blob);

            setImages((prev) => ({
                ...prev,
                [type]: imageUrl
            }));
        }
        catch (err) {
            console.error(`Error fetching ${type} visualization:`, err);
        } finally {
            setLoading(prev => ({ ...prev, [type]: false }));
        }
    };

    // Is use to Pass type to fetchVisualization function
    const types = [
        { id: "pd", label: "Probability of Default", desc: "Waterfall analysis of high-risk probability" },
        { id: "anomaly", label: "Anomaly Detection", desc: "Neural force plot of integrity deviations" },
        { id: "hybrid", label: "Hybrid Credit Score", desc: "Weighted feature importance distribution" },
        { id: "risk", label: "Risk Label", desc: "Lending protocol classification predictors" },
    ];

    if (!analysis) return null;

    return (
        <div style={{ marginTop: '4rem' }}>
            <div style={{ paddingBottom: '2rem', borderBottom: '1px solid var(--border-light)', marginBottom: '3rem' }}>
                <span className="status-tag" style={{ background: 'var(--secondary)', color: 'white' }}>Model Explanation System</span>
                <h2 style={{ marginTop: '1.1rem', fontSize: '2.5rem', fontWeight: 800 }}>Model Explanation (SHAP)</h2>
                <p style={{ color: 'var(--text-soft)', maxWidth: '800px' }}>
                    Visualizing localized SHAP contributions to provide deep institutional transparency into algorithmic logic. This report audits every push-factor influencing the credit assessment.
                </p>
            </div>

            <div className="viz-grid">
                {types.map((type) => (
                    <div key={type.id} className="viz-section">
                        <div className="viz-card">
                            <div className="viz-header">
                                <div className="viz-title-area">
                                    <h4>{type.label}</h4>
                                    <div className="viz-metadata">
                                        <span>TYPE: TECHNICAL_SHAP</span>
                                        <span>•</span>
                                        <span>FIDELITY: HIGH</span>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {images[type.id] && (
                                        <button className="btn" style={{ background: '#f8fafc', color: 'var(--text-soft)', border: '1px solid var(--border-light)', padding: '6px 14px', fontSize: '0.7rem' }} onClick={() => setImages(prev => ({ ...prev, [type.id]: null }))}>
                                            Reset Audit
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="viz-image-container">
                                <span className="audit-tag">ID: {type.id.toUpperCase()}_0921</span>
                                {!images[type.id] ? (
                                    <div className="viz-placeholder">
                                        {loading[type.id] ? (
                                            <div className="viz-loading-ring"></div>
                                        ) : (
                                            <>
                                                <p style={{ fontSize: '0.9rem', textAlign: 'center' }}>{type.desc}</p>
                                                <button className="btn" onClick={() => fetchVisualization(type.id)} style={{ background: 'var(--secondary)', color: 'white', padding: '12px 30px' }}>
                                                    Run SHAP Analysis
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <img
                                        src={images[type.id]}
                                        alt={`${type.label} explanation`}
                                        className="shap-image"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExplainVisualization;
