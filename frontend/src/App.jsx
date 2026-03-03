import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BankStatementPage from "./pages/BankStatementPage";
import FeatureExtractorPage from "./pages/FeatureExtractorPage";
import CreditDecisionPage from "./pages/CreditDecisionPage";
import VisualizationPage from "./pages/VisualizationPage";

function App() {
  return (
    <Router>
      {/* Nav Bar */}
      <nav style={{
        padding: "12px 20px",
        backgroundColor: "#4f6ef7",
        display: "flex",
        gap: "20px"
      }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}>
          🏦 Bank Statement
        </Link>
        <Link to="/feature-extractor" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}>
          🔬 Feature Extractor
        </Link>
        <Link to="/credit-decision" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}>
          🏆 Credit Decision
        </Link>
        <Link to="/explain" style={{ color: "#fff", textDecoration: "none", fontWeight: "bold" }}>
          🧠 Model Explanation
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<BankStatementPage />} />
        <Route path="/feature-extractor" element={<FeatureExtractorPage />} />
        <Route path="/credit-decision" element={<CreditDecisionPage />} />
        <Route path="/explain" element={<VisualizationPage />} />
      </Routes>
    </Router>
  );
}

export default App;