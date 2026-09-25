import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Projects from './pages/admin/Projects';
import Skills from './pages/admin/Skills';
import Messages from './pages/admin/Messages';
import Profile from './pages/admin/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/admin/skills" element={<ProtectedRoute><Skills /></ProtectedRoute>} />
        <Route path="/admin/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
