import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ToastProvider } from './components/common/Toast';
import { PublicLayout } from './components/common/PublicLayout';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { ProjectsPage } from './pages/public/ProjectsPage';
import { ProjectDetailPage } from './pages/public/ProjectDetailPage';
import { TutorialsPage } from './pages/public/TutorialsPage';
import { TutorialDetailPage } from './pages/public/TutorialDetailPage';
import { ResourcesPage } from './pages/public/ResourcesPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { PrivacyPage } from './pages/public/PrivacyPage';
import { TermsPage } from './pages/public/TermsPage';
import { NotFoundPage } from './pages/public/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminProjectEditorPage } from './pages/admin/AdminProjectEditorPage';
import { AdminTutorialsPage } from './pages/admin/AdminTutorialsPage';
import { AdminResourcesPage } from './pages/admin/AdminResourcesPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';

// Scroll to top helper on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <DataProvider>
          <ToastProvider>
            <Routes>
              {/* Public Website Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:slug" element={<ProjectDetailPage />} />
                <Route path="/tutorials" element={<TutorialsPage />} />
                <Route path="/tutorials/:slug" element={<TutorialDetailPage />} />
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Admin Sign-in Route */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              {/* Protected Owner Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminOverviewPage />} />
                <Route path="projects" element={<AdminProjectsPage />} />
                <Route path="projects/new" element={<AdminProjectEditorPage />} />
                <Route path="projects/edit/:id" element={<AdminProjectEditorPage />} />
                <Route path="tutorials" element={<AdminTutorialsPage />} />
                <Route path="resources" element={<AdminResourcesPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="messages" element={<AdminMessagesPage />} />
              </Route>
            </Routes>
          </ToastProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
