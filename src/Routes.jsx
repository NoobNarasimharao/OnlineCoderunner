import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import CodeHistoryDashboard from './pages/code-history-dashboard';
import CodeEditorWorkspace from './pages/code-editor-workspace';
import AccountSettings from './pages/account-settings';
import LanguageSelectionHub from './pages/language-selection-hub';
import UserAuthentication from './pages/user-authentication';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AccountSettings />} />
        <Route path="/code-history-dashboard" element={<CodeHistoryDashboard />} />
        <Route path="/code-editor-workspace" element={<CodeEditorWorkspace />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/language-selection-hub" element={<LanguageSelectionHub />} />
        <Route path="/user-authentication" element={<UserAuthentication />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
