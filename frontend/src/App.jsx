import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import BankStatementPage from "./pages/BankStatementPage";
import FeatureExtractorPage from "./pages/FeatureExtractorPage";
import CreditDecisionPage from "./pages/CreditDecisionPage";
import VisualizationPage from "./pages/VisualizationPage";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      {/* Nav Bar */}
      <nav className="navbar">
        <Link to="/" className="nav-link">
          Hybrid Credit Score Dashboard
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/statement" element={<BankStatementPage />} />
        <Route path="/feature-extractor" element={<FeatureExtractorPage />} />
        <Route path="/credit-decision" element={<CreditDecisionPage />} />
        <Route path="/explain" element={<VisualizationPage />} />
      </Routes>
    </Router>
  );
}

export default App;