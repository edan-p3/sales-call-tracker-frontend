import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { defaultGoals } from '../utils/storage';

const Settings = ({ isOpen, onClose, goals, onUpdateGoals, reps, onUpdateReps, onUpdateLogo, currentLogo }) => {
  const [localGoals, setLocalGoals] = useState(goals || defaultGoals);
  const [localReps, setLocalReps] = useState(reps || []);
  const [newRepName, setNewRepName] = useState('');
  const [localLogo, setLocalLogo] = useState(currentLogo || '');

  if (!isOpen) return null;

  const handleGoalChange = (key, value) => {
    const val = parseInt(value) || 0;
    const newGoalsState = { ...localGoals, [key]: val };
    
    // Auto-update weekly goals if daily changes (optional, but helpful)
    if (key.includes('PerDay')) {
        const weeklyKey = key.replace('PerDay', 'PerWeek');
        newGoalsState[weeklyKey] = val * 5;
    }

    setLocalGoals(newGoalsState);
  };

  const addRep = () => {
    if (newRepName.trim() && !localReps.includes(newRepName.trim())) {
      setLocalReps([...localReps, newRepName.trim()]);
      setNewRepName('');
    }
  };

  const removeRep = (repToRemove) => {
    setLocalReps(localReps.filter(rep => rep !== repToRemove));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onUpdateGoals(localGoals);
    onUpdateReps(localReps);
    onUpdateLogo(localLogo);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-midnight">Settings</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
            {/* Logo Section */}
          <section>
            <h3 className="text-lg font-semibold text-midnight mb-4 flex items-center gap-2">
              <span>🖼️</span> Company Logo
            </h3>
            <div className="flex items-center gap-4">
              {localLogo && (
                <img src={localLogo} alt="Preview" className="h-16 w-auto object-contain border rounded p-1" />
              )}
              <input 
                type="file" 
                accept="image/*"
                onChange={handleLogoUpload}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-midnight
                  hover:file:bg-violet-100"
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">Upload your company logo to display in the header.</p>
          </section>

          {/* Goals Section */}
          <section>
            <h3 className="text-lg font-semibold text-midnight mb-4 flex items-center gap-2">
              <span>🎯</span> Daily Goals
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['calls', 'emails', 'contacts', 'responses', 'meetings'].map(metric => (
                <div key={metric} className="flex flex-col">
                  <label className="text-sm font-medium text-slate-600 mb-1 capitalize">{metric} / Day</label>
                  <input
                    type="number"
                    value={localGoals[`${metric}PerDay`]}
                    onChange={(e) => handleGoalChange(`${metric}PerDay`, e.target.value)}
                    className="p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-midnight/20 focus:border-midnight outline-none"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
             <h3 className="text-lg font-semibold text-midnight mb-4 flex items-center gap-2">
              <span>📅</span> Weekly Goals (Auto-calculated)
            </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['calls', 'emails', 'contacts', 'responses', 'meetings'].map(metric => (
                <div key={metric} className="flex flex-col">
                  <label className="text-sm font-medium text-slate-600 mb-1 capitalize">{metric} / Week</label>
                  <input
                    type="number"
                    value={localGoals[`${metric}PerWeek`]}
                    onChange={(e) => handleGoalChange(`${metric}PerWeek`, e.target.value)}
                    className="p-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed" // Make read-only or editable? Prompt says "Input for weekly", maybe allow override.
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Reps Section */}
          <section>
            <h3 className="text-lg font-semibold text-midnight mb-4 flex items-center gap-2">
              <span>👥</span> Team Members
            </h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Enter rep name"
                value={newRepName}
                onChange={(e) => setNewRepName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addRep()}
                className="flex-1 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-midnight/20 focus:border-midnight outline-none"
              />
              <button 
                onClick={addRep}
                disabled={!newRepName.trim()}
                className="px-6 py-3 bg-midnight text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Add
              </button>
            </div>
            
            <div className="bg-slate-50 rounded-lg border border-slate-100 divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {localReps.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-sm">No reps added yet. Add yourself!</div>
              ) : (
                localReps.map(rep => (
                  <div key={rep} className="p-3 flex justify-between items-center hover:bg-white transition-colors">
                    <span className="font-medium text-slate-700">{rep}</span>
                    <button 
                      onClick={() => removeRep(rep)}
                      className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Remove Rep"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl sticky bottom-0">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-slate-600 font-medium hover:bg-white hover:shadow-sm rounded-lg transition-all border border-transparent hover:border-slate-200"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-2.5 bg-sunset hover:bg-[#e04f44] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95"
          >
            Save Goals
          </button>
        </div>
      </div>
    </div>
  );
};

Settings.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  goals: PropTypes.object,
  onUpdateGoals: PropTypes.func.isRequired,
  reps: PropTypes.array,
  onUpdateReps: PropTypes.func.isRequired,
  onUpdateLogo: PropTypes.func.isRequired,
  currentLogo: PropTypes.string
};

export default Settings;
