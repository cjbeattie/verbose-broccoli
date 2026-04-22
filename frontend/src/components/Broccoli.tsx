import { ErrorBoundary } from "react-error-boundary";
import BroccoliFact from "./BroccoliFact";
import styles from "./Broccoli.module.css";

function ErrorFallback() {
  return <p>🥦 The broccoli is unavailable. Please try again later.</p>;
}

function Broccoli() {
  return (
    <div className={styles.wrapper}>
      <h1>🥦 The Broccoli Vault</h1>
      <p>Unlock the ancient secrets of broccoli.</p>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <BroccoliFact />
      </ErrorBoundary>
    </div>
  );
}

export default Broccoli;
