import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import SubmitPage from "./pages/SubmitPage";
import DisplayPage from "./pages/DisplayPage";
import HelpPage from "./pages/HelpPage";
import "@fontsource/caveat/latin-700.css";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/submit" replace />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route path="/display" element={<DisplayPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
);
