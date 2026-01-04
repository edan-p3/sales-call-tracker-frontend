import React from 'react';
import PropTypes from 'prop-types';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './WeekSelector.css'; // Create this file for custom datepicker styles if needed

const WeekSelector = ({ currentWeek, onChange }) => {
  const handlePrev = () => onChange(subWeeks(currentWeek, 1));
  const handleNext = () => onChange(addWeeks(currentWeek, 1));

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday start
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

  return (
    <div className="flex items-center gap-4 bg-slate-100 rounded-lg p-1">
      <button 
        onClick={handlePrev} 
        className="p-2 hover:bg-white rounded-md transition-shadow text-slate-600 hover:text-midnight"
        aria-label="Previous Week"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      
      <div className="relative">
        <DatePicker
            selected={currentWeek}
            onChange={(date) => onChange(date)}
            customInput={
              <button className="font-medium px-2 min-w-[220px] text-center text-slate-700 hover:text-midnight focus:outline-none">
                {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
              </button>
            }
            calendarClassName="shadow-lg border-0 rounded-xl font-sans"
        />
      </div>
      
      <button 
        onClick={handleNext} 
        className="p-2 hover:bg-white rounded-md transition-shadow text-slate-600 hover:text-midnight"
        aria-label="Next Week"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>
  );
};

WeekSelector.propTypes = {
  currentWeek: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired
};

export default WeekSelector;
