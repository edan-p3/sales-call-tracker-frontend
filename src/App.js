import React, { useState, useEffect, useCallback } from 'react';
import { format, startOfWeek } from 'date-fns';
import Dashboard from './components/Dashboard';
import WeekSelector from './components/WeekSelector';
import Settings from './components/Settings';
import { getGoals, getReps, saveReps, saveGoals, getWeekData, saveWeekData, getLogo, saveLogo } from './utils/storage';

function App() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedRep, setSelectedRep] = useState('');
  const [reps, setReps] = useState([]);
  const [goals, setGoals] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [weekData, setWeekData] = useState(null);
  const [notification, setNotification] = useState(null);
  const [logo, setLogo] = useState(null);

  // Load initial data
  useEffect(() => {
    const loadedReps = getReps();
    const loadedGoals = getGoals();
    const loadedLogo = getLogo();
    setReps(loadedReps);
    setGoals(loadedGoals);
    setLogo(loadedLogo);

    if (loadedReps.length > 0) {
      setSelectedRep(loadedReps[0]);
    } else {
      setIsSettingsOpen(true); // Prompt to add reps
    }
  }, []);

  // Load week data when rep or week changes
  useEffect(() => {
    if (selectedRep) {
      const weekStartStr = format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const data = getWeekData(weekStartStr, selectedRep);
      
      if (data) {
        setWeekData(data);
      } else {
        // Initialize empty data for the week
        setWeekData({
          rep: selectedRep,
          weekStart: weekStartStr,
          monday: { calls: '', emails: '', contacts: '', responses: '' },
          tuesday: { calls: '', emails: '', contacts: '', responses: '' },
          wednesday: { calls: '', emails: '', contacts: '', responses: '' },
          thursday: { calls: '', emails: '', contacts: '', responses: '' },
          friday: { calls: '', emails: '', contacts: '', responses: '' },
        });
      }
    }
  }, [currentWeek, selectedRep]);

  const handleSaveData = useCallback(() => {
    if (weekData && selectedRep) {
      const weekStartStr = format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      const success = saveWeekData(weekStartStr, selectedRep, weekData);
      if (success) {
        // showNotification('Data saved successfully!', 'success'); // Too noisy for auto-save
      } else {
        showNotification('Failed to save data.', 'error');
      }
    }
  }, [weekData, selectedRep, currentWeek]); // Added dependencies

  // Auto-save effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (weekData) {
        handleSaveData();
      }
    }, 500); // Debounce auto-save by 500ms

    return () => clearTimeout(timeoutId);
  }, [weekData, handleSaveData]);


  const handleManualSave = () => {
      handleSaveData();
      showNotification('Data saved successfully!', 'success');
  };

  const handleUpdateGoals = (newGoals) => {
    saveGoals(newGoals);
    setGoals(newGoals);
    showNotification('Goals updated!', 'success');
  };

  const handleUpdateReps = (newReps) => {
    saveReps(newReps);
    setReps(newReps);
    if (!selectedRep && newReps.length > 0) {
      setSelectedRep(newReps[0]);
    }
    showNotification('Reps list updated!', 'success');
  };

  const handleUpdateLogo = (newLogo) => {
    saveLogo(newLogo);
    setLogo(newLogo);
    showNotification('Logo updated!', 'success');
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  if (!goals) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-midnight text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              {logo && <img src={logo} alt="Company Logo" className="h-10 w-auto rounded bg-white p-1" />}
              <h1 className="text-xl font-bold tracking-tight">Sales Activity Tracker</h1>
            </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-opacity-80 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Settings"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Controls: Week Selector & Rep Selector */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="w-full md:w-auto">
             <WeekSelector currentWeek={currentWeek} onChange={setCurrentWeek} />
          </div>

          <div className="w-full md:w-auto">
             <select 
               value={selectedRep} 
               onChange={(e) => setSelectedRep(e.target.value)}
               className="w-full md:w-64 p-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-midnight focus:border-transparent outline-none"
             >
               {reps.length === 0 && <option value="">No Reps Added</option>}
               {reps.map(rep => (
                 <option key={rep} value={rep}>{rep}</option>
               ))}
             </select>
          </div>
        </div>

        {selectedRep && weekData ? (
          <Dashboard 
            weekData={weekData} 
            setWeekData={setWeekData} 
            goals={goals} 
            onSave={handleManualSave}
            reps={reps}
          />
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl text-slate-500">
              {reps.length === 0 ? "Please add sales reps in settings." : "Select a sales rep to view data."}
            </h2>
          </div>
        )}
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <Settings 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          goals={goals} 
          onUpdateGoals={handleUpdateGoals}
          reps={reps}
          onUpdateReps={handleUpdateReps}
          onUpdateLogo={handleUpdateLogo}
          currentLogo={logo}
        />
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 ${notification.type === 'success' ? 'bg-emerald' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default App;
