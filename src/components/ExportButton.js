import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { exportToExcel } from '../utils/excelExport';
import { getAllWeekData } from '../utils/storageAPI';
import { useAuth } from '../context/AuthContext';

const ExportButton = ({ goals }) => {
  const { user } = useAuth();
  const [showSheetsModal, setShowSheetsModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExcelExport = async () => {
    try {
      setExporting(true);
      const allData = await getAllWeekData();
      
      if (!allData || allData.length === 0) {
        alert('No data to export. Enter some activity data first!');
        return;
      }

      const success = exportToExcel(allData, goals, user);
      if (success) {
        alert('Export successful! Check your downloads folder.'); 
      } else {
        alert('Export failed. Check console for details.');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Check console for details.');
    } finally {
      setExporting(false);
    }
  };

  const handleGoogleSheetsClick = () => {
    setShowSheetsModal(true);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
         <button 
          onClick={handleGoogleSheetsClick}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-medium rounded-lg border-2 border-slate-300 hover:bg-slate-50 hover:border-emerald-400 transition-all shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.5 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V7.5L14.5 2Z" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 2V8H20" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 13H16" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 17H16" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 9H8" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-semibold">Google Sheets</span>
        </button>

        <button 
          onClick={handleExcelExport}
          disabled={exporting}
          style={{ backgroundColor: exporting ? '#94a3b8' : '#10b981', color: '#ffffff' }}
          className="flex items-center justify-center gap-2 px-8 py-3 font-semibold rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed border-2 border-emerald-700"
        >
          {exporting ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>Export to Excel</span>
            </>
          )}
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
              <strong>Workaround:</strong> You can click "Export to Excel" and then import that file directly into Google Sheets (File &gt; Import).
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
  goals: PropTypes.object.isRequired
};

export default ExportButton;
