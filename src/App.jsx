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
import StoryList from "./components/StoryList.jsx";
import StoryRead from "./components/StoryRead.jsx";
import DialogList from "./components/DialogList.jsx";
import DialogRead from "./components/DialogRead.jsx";
import TextbookHome from "./components/textbook/TextbookHome.jsx";
import TextbookSelect from "./components/textbook/TextbookSelect.jsx";
import TextbookUnit from "./components/textbook/TextbookUnit.jsx";
import TextbookGame from "./components/textbook/TextbookGame.jsx";
import TextbookBoard from "./components/textbook/TextbookBoard.jsx";
import TabBar from "./components/TabBar.jsx";
import { useDevice } from "./lib/useDevice";

const ROOT_TABS = ["/", "/tb", "/review", "/me"];

export default function App() {
  const loc = useLocation();
  const { isMobile, isTablet, isPad, isLandscape } = useDevice();
  const showTabs = (isMobile || isTablet) && (ROOT_TABS.includes(loc.pathname) || loc.pathname.startsWith('/tb/'));

  useEffect(() => {
    document.body.classList.toggle("has-tabbar", showTabs);
    return () => document.body.classList.remove("has-tabbar");
  }, [showTabs]);

  const appClass = [
    "app",
    isMobile ? "is-mobile" : isTablet ? "is-tablet" : "is-desktop",
    isPad ? (isLandscape ? "is-pad-landscape" : "is-pad-portrait") : "",
    isLandscape ? "is-landscape" : "is-portrait",
  ].filter(Boolean).join(" ");

  return (
    <div className={appClass}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/me" element={<ProfilePage />} />
        <Route path="/mistakes" element={<MistakesPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/story" element={<StoryList />} />
        <Route path="/story/:id" element={<StoryRead />} />
        <Route path="/dialog" element={<DialogList />} />
        <Route path="/dialog/:id" element={<DialogRead />} />
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
