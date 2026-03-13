import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import BankStatementPage from "./pages/BankStatementPage";
import FeatureExtractorPage from "./pages/FeatureExtractorPage";
import CreditDecisionPage from "./pages/CreditDecisionPage";
import VisualizationPage from "./pages/VisualizationPage";
import Dashboard from "./pages/Dashboard";
import SystemArchitecture from "./pages/SystemArchitecture";
import MLModelPipeline from "./pages/MLModelPipeline";

function NavBar() {
  const loc = useLocation();
  return (
    <nav className="navbar">
      <Link to="/" className={`nav-link${loc.pathname === "/" ? " active" : ""}`}>
        Hybrid Credit Score
      </Link>
      <Link to="/architecture" className={`nav-link${loc.pathname === "/architecture" ? " active" : ""}`}>
        Architecture
      </Link>
      <Link to="/ml-pipeline" className={`nav-link${loc.pathname === "/ml-pipeline" ? " active" : ""}`}>
        ML Pipeline
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/statement" element={<BankStatementPage />} />
        <Route path="/feature-extractor" element={<FeatureExtractorPage />} />
        <Route path="/credit-decision" element={<CreditDecisionPage />} />
        <Route path="/explain" element={<VisualizationPage />} />
        <Route path="/architecture" element={<SystemArchitecture />} />
        <Route path="/ml-pipeline" element={<MLModelPipeline />} />
      </Routes>
    </Router>
  );
}

export default App;