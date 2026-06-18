import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./components/HomePage.jsx";
import LevelPage from "./components/LevelPage.jsx";
import UnitPage from "./components/UnitPage.jsx";
import GamePage from "./components/GamePage.jsx";
import ResultPage from "./components/ResultPage.jsx";
import ReviewPage from "./components/ReviewPage.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import MistakesPage from "./components/MistakesPage.jsx";
import HelpPage from "./components/HelpPage.jsx";
import AchievementsPage from "./components/AchievementsPage.jsx";
import ReportPage from "./components/ReportPage.jsx";
import TextbookHome from "./components/textbook/TextbookHome.jsx";
import TextbookSelect from "./components/textbook/TextbookSelect.jsx";
import TextbookUnit from "./components/textbook/TextbookUnit.jsx";
import TextbookGame from "./components/textbook/TextbookGame.jsx";
import TextbookBoard from "./components/textbook/TextbookBoard.jsx";
import TabBar from "./components/TabBar.jsx";
import { useIsMobile } from "./lib/useIsMobile";

const ROOT_TABS = ["/", "/tb", "/review", "/me"];

export default function App() {
  const loc = useLocation();
  const isMobile = useIsMobile();
  const showTabs = isMobile && (ROOT_TABS.includes(loc.pathname) || loc.pathname.startsWith('/tb/'));

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
        <Route path="/mistakes" element={<MistakesPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/tb" element={<TextbookSelect />} />
        <Route path="/tb/:bookId" element={<TextbookBoard />} />
        <Route path="/tb/:bookId/home" element={<TextbookHome />} />
        <Route path="/tb/:bookId/:unitId" element={<TextbookUnit />} />
        <Route path="/tb/:bookId/:unitId/:type" element={<TextbookGame />} />
        <Route path="/level/:levelId" element={<LevelPage />} />
        <Route path="/unit/:levelId/:unitId" element={<UnitPage />} />
        <Route path="/game/:levelId/:unitId/:gameType" element={<GamePage />} />
        <Route path="/result/:levelId/:unitId/:gameType/:stars" element={<ResultPage />} />
      </Routes>
      {showTabs && <TabBar />}
    </div>
  );
}
