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
          <div className="text-sm text-slate-500 hidden sm:block">
            Data auto-saves as you type
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

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4 border-t border-slate-200">
         <ExportButton goals={goals} reps={reps} />
         <button 
           onClick={onSave}
           className="w-full sm:w-auto px-8 py-3 bg-sunset hover:bg-[#e04f44] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95"
         >
           Save This Week's Data
         </button>
      </div>
      
      <div className="text-center text-xs text-slate-400 mt-4">
         Note: This is a browser-based tracker. To share data live with your team, a backend server is required.
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  weekData: PropTypes.object.isRequired,
  setWeekData: PropTypes.func.isRequired,
  goals: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  reps: PropTypes.array.isRequired
};

export default Dashboard;
