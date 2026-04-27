import { Routes, Route } from "react-router-dom";
import CreatePoll from "./pages/CreatePoll";
import PollPage from "./pages/PollPage";
// import Broccoli from "./components/Broccoli";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreatePoll />} />
      <Route path="/:id" element={<PollPage />} />
    </Routes>
  );
}

export default App;
