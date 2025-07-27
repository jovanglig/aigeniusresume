import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ResumeScanner from "@/components/ResumeScanner";
import ResumeBuilder from "@/components/ResumeBuilder";
import Home from "@/components/home";
import JobDashboard from "@/components/JobDashboard";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/resume-scanner" element={<ResumeScanner />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
        <Route path="/job-dashboard" element={<JobDashboard />} />
      </Routes>
    </Suspense>
  );
}

export default App;
