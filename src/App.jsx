import { Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import LevelPage from "./components/LevelPage.jsx";
import UnitPage from "./components/UnitPage.jsx";
import GamePage from "./components/GamePage.jsx";
import ResultPage from "./components/ResultPage.jsx";
import ReviewPage from "./components/ReviewPage.jsx";

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/level/:levelId" element={<LevelPage />} />
        <Route path="/unit/:levelId/:unitId" element={<UnitPage />} />
        <Route path="/game/:levelId/:unitId/:gameType" element={<GamePage />} />
        <Route path="/result/:levelId/:unitId/:gameType/:stars" element={<ResultPage />} />
      </Routes>
    </div>
  );
}

