import React, { useState, useEffect, useCallback } from 'react';
import { format, startOfWeek } from 'date-fns';
import Dashboard from './Dashboard';
import WeekSelector from './WeekSelector';
import Settings from './Settings';
import { getGoals, saveGoals, getWeekData, saveWeekData, getLogo, saveLogo } from '../utils/storageAPI';
import { useAuth } from '../context/AuthContext';

function MainApp() {
  const { user, logout } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [goals, setGoals] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [weekData, setWeekData] = useState(null);
  const [notification, setNotification] = useState(null);
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const loadedGoals = await getGoals();
        const loadedLogo = getLogo();
        setGoals(loadedGoals);
        setLogo(loadedLogo);
      } catch (error) {
        console.error('Error loading initial data:', error);
        showNotification('Error loading data', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load week data when week changes
  useEffect(() => {
    const loadWeekData = async () => {
      if (!user) return;
      
      const weekStartStr = format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      try {
        const data = await getWeekData(weekStartStr);
        
        if (data) {
          setWeekData(data);
        } else {
          // Initialize empty data for the week
          setWeekData({
            weekStart: weekStartStr,
            monday: { calls: '', emails: '', contacts: '', responses: '' },
            tuesday: { calls: '', emails: '', contacts: '', responses: '' },
            wednesday: { calls: '', emails: '', contacts: '', responses: '' },
            thursday: { calls: '', emails: '', contacts: '', responses: '' },
            friday: { calls: '', emails: '', contacts: '', responses: '' },
          });
        }
      } catch (error) {
        console.error('Error loading week data:', error);
        showNotification('Error loading week data', 'error');
      }
    };

    loadWeekData();
  }, [currentWeek, user]);

  const handleSaveData = useCallback(async () => {
    if (weekData) {
      const weekStartStr = format(startOfWeek(currentWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd');
      try {
        const success = await saveWeekData(weekStartStr, weekData);
        if (!success) {
          showNotification('Failed to save data.', 'error');
        }
      } catch (error) {
        console.error('Error saving data:', error);
        showNotification('Failed to save data.', 'error');
      }
    }
  }, [weekData, currentWeek]);

  // Auto-save effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (weekData) {
        handleSaveData();
      }
    }, 500); // Debounce auto-save by 500ms

    return () => clearTimeout(timeoutId);
  }, [weekData, handleSaveData]);

  const handleManualSave = async () => {
    await handleSaveData();
    showNotification('Data saved successfully!', 'success');
  };

  const handleUpdateGoals = async (newGoals) => {
    try {
      await saveGoals(newGoals);
      setGoals(newGoals);
      showNotification('Goals updated!', 'success');
    } catch (error) {
      console.error('Error updating goals:', error);
      showNotification('Failed to update goals', 'error');
    }
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

  const handleLogout = () => {
    logout();
  };

  if (loading || !goals) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-midnight text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            {logo && <img src={logo} alt="Company Logo" className="h-10 w-auto rounded bg-white p-1" />}
            <h1 className="text-xl font-bold tracking-tight">Sales Activity Tracker</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-200">
              {user?.firstName} {user?.lastName}
            </span>
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
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Controls: Week Selector */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="w-full md:w-auto">
            <WeekSelector currentWeek={currentWeek} onChange={setCurrentWeek} />
          </div>
        </div>

        {weekData ? (
          <Dashboard 
            weekData={weekData} 
            setWeekData={setWeekData} 
            goals={goals} 
            onSave={handleManualSave}
          />
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl text-slate-500">Loading...</h2>
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
          onUpdateLogo={handleUpdateLogo}
          currentLogo={logo}
        />
      )}

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}
    </div>
  );
}

export default MainApp;

