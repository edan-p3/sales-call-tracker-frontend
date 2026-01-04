import React from 'react';
import PropTypes from 'prop-types';
import { calculateProgress } from '../utils/calculations';

const SummaryCard = ({ title, value, goal, color }) => {
  const progress = calculateProgress(value, goal);
  const isGoalMet = value >= goal;
  const progressColor = isGoalMet ? 'bg-emerald' : 'bg-midnight';
  const textColor = isGoalMet ? 'text-emerald' : 'text-midnight';

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-md transition-shadow">
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-16 h-16 opacity-5 rounded-full -mr-8 -mt-8 ${progressColor} transition-colors duration-500`}></div>
      
      <div className="flex justify-between items-start z-10">
        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
        {isGoalMet && (
          <span className="animate-bounce text-emerald" aria-label="Goal Met">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </span>
        )}
      </div>

      <div className="z-10">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${textColor} transition-colors duration-300`}>{value}</span>
          <span className="text-slate-400 text-sm font-medium">/ {goal}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100">
        <div 
          className={`h-full ${progressColor} transition-all duration-1000 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  goal: PropTypes.number.isRequired,
  color: PropTypes.string
};

export default SummaryCard;

