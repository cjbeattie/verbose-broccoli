import { Suspense } from "react";
import Broccoli from "./components/Broccoli";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Broccoli />
    </Suspense>
  );
}

export default App;