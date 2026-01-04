import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { exportToExcel } from '../utils/excelExport';
import { getAllWeekData } from '../utils/storage';

const ExportButton = ({ goals, reps }) => {
  const [showSheetsModal, setShowSheetsModal] = useState(false);

  const handleExcelExport = () => {
    const allData = getAllWeekData();
    const success = exportToExcel(allData, goals, reps);
    if (success) {
      alert('Export successful!'); 
    } else {
      alert('Export failed. Check console for details.');
    }
  };

  const handleGoogleSheetsClick = () => {
    // Since we don't have a backend or Sheets API setup, we'll guide the user
    // to export CSV or explain the limitation as requested.
    // For now, let's open a modal or alert explaining the process.
    setShowSheetsModal(true);
  };

  return (
    <>
      <div className="flex gap-2">
         <button 
          onClick={handleGoogleSheetsClick}
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.5 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V7.5L14.5 2Z" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 13H16" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 17H16" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 9H8" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Google Sheets
        </button>

        <button 
          onClick={handleExcelExport}
          className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Export to Excel
        </button>
      </div>

      {showSheetsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full animate-fade-in">
            <h3 className="text-xl font-bold text-midnight mb-4">Google Sheets Sync</h3>
            <p className="text-slate-600 mb-4">
              Direct syncing to Google Sheets requires a backend server or complex API configuration. 
            </p>
            <p className="text-slate-600 mb-6">
              <strong>Workaround:</strong> You can click "Export to Excel" and then import that file directly into Google Sheets (File > Import).
            </p>
            <div className="flex justify-end">
              <button 
                onClick={() => setShowSheetsModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

ExportButton.propTypes = {
  goals: PropTypes.object.isRequired,
  reps: PropTypes.array.isRequired
};

export default ExportButton;
