import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Broccoli from "./components/Broccoli";
import QuoteRoundsList from "./components/QuoteRoundsList";
import QuoteRoundDetail from "./components/QuoteRoundDetail";

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<p>Loading...</p>}>
        {/* <Broccoli /> */}
        <Routes>
          <Route path="/" element={<QuoteRoundsList />} />
          <Route path="/quote-rounds/:id" element={<QuoteRoundDetail />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;