import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import BroccoliFact from "./components/BroccoliFact";

function ErrorFallback() {
  return <p>🥦 The broccoli is unavailable. Please try again later.</p>;
}

function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "sans-serif" }}>
      <h1>🥦 The Broccoli Vault</h1>
      <p>Unlock the ancient secrets of broccoli.</p>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<p>Consulting the broccoli...</p>}>
          <BroccoliFact />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;