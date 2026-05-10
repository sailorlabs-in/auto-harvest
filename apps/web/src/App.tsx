import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { GamePage } from './pages/GamePage';
import { GuidePage } from './pages/GuidePage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen bg-farm-975">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/guide" element={<GuidePage />} />
        {/* Guest mode: play without account (localStorage saves only) */}
        <Route path="/game" element={<GamePage />} />
        {/* Authenticated: world-based saves synced to server */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/game/:worldId" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
