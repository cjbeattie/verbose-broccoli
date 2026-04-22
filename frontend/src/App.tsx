import { Suspense } from "react";
import BroccoliFact from "./components/BroccoliFact";

function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px", fontFamily: "sans-serif" }}>
      <h1>🥦 The Broccoli Vault</h1>
      <p>Unlock the ancient secrets of broccoli.</p>
      <Suspense fallback={<p>Consulting the broccoli...</p>}>
        <BroccoliFact />
      </Suspense>
    </div>
  );
}

export default App;