import React, { useState } from "react";
import { getVisualization } from "../api/visualizationAPI";

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

    const fetchVisualization = async (type) => {
        if (!analysis) return;
        try {
            // Call Backend API to get Visualization
            // blob : PNG bytes
            const blob = await getVisualization(type, analysis);

            // Convert Blob to URL
            const imageUrl = URL.createObjectURL(blob);

            // set image in state
            setImages((prev) => ({
                ...prev,
                [type]: imageUrl
            }));
        }
        catch (err) {
            console.error(`Error fetching ${type} visualization:`, err);
        }
    };

    // Is use to Pass type to fetchVisualization function
    const types = [
        { id: "pd", label: "Probability of Default (PD)" },
        { id: "anomaly", label: "Anomaly Detection" },
        { id: "hybrid", label: "Hybrid Credit Score" },
        { id: "risk", label: "Risk Label" },
    ];

    if (!analysis) return null;

    return (
        <div >
            <h3>
                Model Explainability (SHAP)
            </h3>
            <p>
                Click the buttons below to visualize how each feature contributes to the model's decision using SHAP (SHapley Additive exPlanations).
            </p>

            <div>
                {types.map((type) => (
                    <div key={type.id} >
                        <h4>{type.label}</h4>

                        {/* When Click on Generate Explanation Button : Call fetchVisualization function with types id */}
                        {/* If images[type.id] is null : Then Display Generate Button otherwise image will be display */}
                        {!images[type.id] ?
                            (
                                <button onClick={() => fetchVisualization(type.id)}>
                                    Generate Explanation
                                </button>
                            )
                            :
                            (
                                <div>
                                    <img
                                        src={images[type.id]}
                                        alt={`${type.label} explanation`}
                                        style={{ maxWidth: "100%", borderRadius: "6px", marginBottom: "12px", border: "1px solid #eee" }}
                                    />
                                    <button onClick={() => setImages(prev => ({ ...prev, [type.id]: null }))}>
                                        Remove Explanation
                                    </button>
                                </div>
                            )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExplainVisualization;
