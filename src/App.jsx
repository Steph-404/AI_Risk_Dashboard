import { useState, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import MentorDashboard from './views/MentorDashboard';
import OpportunityPulse from './views/OpportunityPulse';
import JuniorProfileModal from './views/JuniorProfileModal';

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
    <div className="flex min-h-screen bg-[#0F0F1A]">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-[260px]">
        {/* Top Bar */}
        <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

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
                element={<MentorDashboard onSelectJunior={handleSelectJunior} />}
              />
              <Route
                path="/opportunities"
                element={<OpportunityPulse />}
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
