import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./lib/auth.jsx";
import { ProgressProvider } from "./lib/progress.jsx";

/* 本地化字体与图标（去掉外部 CDN 依赖，适配 Coze webview / 严格 CSP） */
import "@fontsource/fredoka/400.css";
import "@fontsource/fredoka/500.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";
import "@tabler/icons-webfont/dist/tabler-icons.min.css";
import "./styles.css";

import { initTheme } from "./lib/theme";
initTheme();

createRoot(document.getElementById("app")).render(
  <StrictMode>
    <AuthProvider>
      <ProgressProvider>
        <HashRouter>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </HashRouter>
      </ProgressProvider>
    </AuthProvider>
  </StrictMode>
);
