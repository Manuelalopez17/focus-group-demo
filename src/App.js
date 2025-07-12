// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AdminPanel from "./components/AdminPanel";
import RiskEvaluationForm from "./components/RiskEvaluationForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/:sessionId" element={<AdminPanel />} />
        <Route path="/session/:sessionId" element={<RiskEvaluationForm />} />
      </Routes>
    </Router>
  );
}

export default App;

