import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import SummaryCard from './SummaryCard';
import ActivityGrid from './ActivityGrid';
import ExportButton from './ExportButton';
import { calculateWeeklyTotals } from '../utils/calculations';

const Dashboard = ({ weekData, setWeekData, goals, onSave, reps }) => {
  const totals = useMemo(() => calculateWeeklyTotals(weekData), [weekData]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard 
          title="Total Calls" 
          value={totals.calls} 
          goal={goals.callsPerWeek} 
          color="midnight" 
        />
        <SummaryCard 
          title="Total Emails" 
          value={totals.emails} 
          goal={goals.emailsPerWeek} 
          color="midnight" 
        />
        <SummaryCard 
          title="Total Contacts" 
          value={totals.contacts} 
          goal={goals.contactsPerWeek} 
          color="midnight" 
        />
        <SummaryCard 
          title="Total Responses" 
          value={totals.responses} 
          goal={goals.responsesPerWeek} 
          color="midnight" 
        />
        <SummaryCard 
          title="Total Meetings" 
          value={totals.meetings} 
          goal={goals.meetingsPerWeek || 10} 
          color="midnight" 
        />
      </div>

      {/* Activity Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-midnight">Daily Activity</h2>
          <div className="text-sm text-emerald-600 font-medium flex items-center gap-2">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Auto-saves as you type
          </div>
        </div>
        <div className="p-0 overflow-x-auto">
          <ActivityGrid 
            data={weekData} 
            onChange={setWeekData} 
            goals={goals}
          />
        </div>
      </div>

      {/* Export Buttons Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-left">
            <h3 className="text-lg font-semibold text-midnight mb-1">Export Your Data</h3>
            <p className="text-sm text-slate-500">Download your activity data as an Excel file or sync to Google Sheets</p>
          </div>
          <ExportButton goals={goals} />
        </div>
      </div>
      
      <div className="text-center text-xs text-slate-500 mt-4 space-y-1">
         <p className="font-semibold text-midnight">Powered by P3 Media</p>
         <p>This live sales tracker is built for real-time reporting and collaboration. Metrics update dynamically and are designed to support team-wide visibility and performance tracking.</p>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  weekData: PropTypes.object.isRequired,
  setWeekData: PropTypes.func.isRequired,
  goals: PropTypes.object.isRequired,
  onSave: PropTypes.func, // Optional now since auto-save handles it
  reps: PropTypes.array
};

export default Dashboard;
