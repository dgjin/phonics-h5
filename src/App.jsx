import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import LevelPage from "./components/LevelPage.jsx";
import UnitPage from "./components/UnitPage.jsx";
import GamePage from "./components/GamePage.jsx";
import ResultPage from "./components/ResultPage.jsx";
import ReviewPage from "./components/ReviewPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import TabBar from "./components/TabBar.jsx";
import { useIsMobile } from "./lib/useIsMobile";

const ROOT_TABS = ["/", "/review", "/me"];

export default function App() {
  const loc = useLocation();
  const isMobile = useIsMobile();
  const showTabs = isMobile && ROOT_TABS.includes(loc.pathname);

  useEffect(() => {
    document.body.classList.toggle("has-tabbar", showTabs);
    return () => document.body.classList.remove("has-tabbar");
  }, [showTabs]);

  return (
    <div className={"app" + (isMobile ? " is-mobile" : "")}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/me" element={<ProfilePage />} />
        <Route path="/level/:levelId" element={<LevelPage />} />
        <Route path="/unit/:levelId/:unitId" element={<UnitPage />} />
        <Route path="/game/:levelId/:unitId/:gameType" element={<GamePage />} />
        <Route path="/result/:levelId/:unitId/:gameType/:stars" element={<ResultPage />} />
      </Routes>
      {showTabs && <TabBar />}
    </div>
  );
}
