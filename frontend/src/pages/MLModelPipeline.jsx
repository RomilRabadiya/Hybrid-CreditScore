import React from 'react';
import { motion } from 'framer-motion';
import AnomalyDetection from '../components/AnomalyDetection';
import PDModel from '../components/PDModel';
import RiskClassification from '../components/RiskClassification';
import HybridCreditScore from '../components/HybridCreditScore';
import '../styles/MLModelPipeline.css';

const MLModelPipeline = () => {
    return (
        <div className="ml-pipeline-page">
            <motion.header
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="ml-header"
            >
                <h1 className="text-gradient">ML Model Pipeline</h1>
                <p className="subtitle">High-Fidelity Technical Breakdown of Risk Intelligence</p>
            </motion.header>

            <div className="pipeline-sections">
                <AnomalyDetection />
                <PDModel />
                <RiskClassification />
                <HybridCreditScore />
            </div>
        </div>
    );
};

export default MLModelPipeline;
