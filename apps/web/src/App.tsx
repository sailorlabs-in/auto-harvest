import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { GamePage } from './pages/GamePage';
import { GuidePage } from './pages/GuidePage';

function App() {
  return (
    <div className="min-h-screen bg-farm-975">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/game/:worldId" element={<GamePage />} />
      </Routes>
    </div>
  );
}

export default App;
