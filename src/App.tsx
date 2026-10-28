import React, { useState } from "react";
import { DiagnosticForm } from "./features/diagnostic/components/DiagnosticForm";

function App() {
  const [diagnosticResult, setDiagnosticResult] = useState(null);
  return (
    <div className="min-h-screen bg-gradient text-slate-800 flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-4xl bg-brand-container rounded-2xl shadow-2xl p-6 md:p-8 border border-brand-secondary/30">
        <h1 className="text-2xl md:text-3xl font-bold text-brand-bg-base mb-2">
          Hardware Diagnostic Engine
        </h1>
        <p className="text-slate-600 mb-6">
          Select your professional profile and your desktop to analize neck
        </p>

        <DiagnosticForm onResult={(result) => setDiagnosticResult(result)} />

        {diagnosticResult && (
          <div className="mt-8 p-6 bg-slate-900 text-slate-200 rounded-xl shadow-inner overflow-x-auto">
            <h3 className="text-lg font-semibold text-brand-button mb-2">
              Diagnostic Result Preview (Raw JSON):
            </h3>
            <pre className="text-xs font-mono">
              {JSON.stringify(diagnosticResult, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
