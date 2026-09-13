import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AdminLayout } from '@/src/components/layout/AdminLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardOverview } from './pages/DashboardOverview';
import { ProfilePage } from './pages/ProfilePage';
import { SkillsPage } from './pages/SkillsPage';
import { ExperiencePage } from './pages/ExperiencePage';
import { EducationPage } from './pages/EducationPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { PostsPage } from './pages/PostsPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { SocialsPage } from './pages/SocialsPage';
import { SettingsPage } from './pages/SettingsPage';
import { MediaPage } from './pages/MediaPage';
import { MessagesPage } from './pages/MessagesPage';
import { FaqsPage } from './pages/FaqsPage';

function LegacyAdminRedirect() {
  const location = useLocation();
  const cleanPath = location.pathname.replace(/^\/admin/, '') || '/';
  return <Navigate to={`${cleanPath}${location.search}${location.hash}`} replace />;
}

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected Routes without /admin prefix */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<DashboardOverview />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="experience" element={<ExperiencePage />} />
        <Route path="education" element={<EducationPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="testimonials" element={<TestimonialsPage />} />
        <Route path="socials" element={<SocialsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="faqs" element={<FaqsPage />} />
      </Route>

      {/* Redirects for legacy /admin URLs */}
      <Route path="/admin" element={<Navigate to="/" replace />} />
      <Route path="/admin/*" element={<LegacyAdminRedirect />} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
