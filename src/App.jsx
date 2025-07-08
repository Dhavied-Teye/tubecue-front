import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import Landing from "./pages/user/Landing";
import KeywordStep from "./pages/user/KeywordStep";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/search/:videoId" element={<KeywordStep />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
