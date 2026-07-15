import { useState, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MentorDashboard from './views/MentorDashboard';
import Team from './views/Team';
import OpportunityPulse from './views/OpportunityPulse';
import LiquidBackground from './components/LiquidBackground';
import JuniorProfileModal from './views/JuniorProfileModal';
import Settings from './views/Settings';
import Support from './views/Support';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedJunior, setSelectedJunior] = useState(null);
  const location = useLocation();

  const handleSelectJunior = useCallback((junior) => {
    setSelectedJunior(junior);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedJunior(null);
  }, []);

  return (
    <div className="app-layout bg-transparent relative z-0">
      <LiquidBackground />

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-content-wrapper max-w-[100vw]">
        {/* Top Bar */}
        <TopBar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          onSelectJunior={handleSelectJunior}
        />

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={<MentorDashboard onSelectJunior={handleSelectJunior} />}
              />
              <Route
                path="/team"
                element={<Team onSelectJunior={handleSelectJunior} />}
              />

              <Route
                path="/opportunities"
                element={<OpportunityPulse />}
              />
              <Route
                path="/settings"
                element={<Settings />}
              />
              <Route
                path="/support"
                element={<Support />}
              />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      {/* Junior Profile Modal */}
      <AnimatePresence>
        {selectedJunior && (
          <JuniorProfileModal
            junior={selectedJunior}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
