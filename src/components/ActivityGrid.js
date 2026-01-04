import React from 'react';
import PropTypes from 'prop-types';

const ActivityGrid = ({ data, onChange, goals }) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const metrics = [
    { key: 'calls', label: 'Calls', goal: goals.callsPerDay },
    { key: 'emails', label: 'Emails', goal: goals.emailsPerDay },
    { key: 'contacts', label: 'Contacts', goal: goals.contactsPerDay },
    { key: 'responses', label: 'Responses', goal: goals.responsesPerDay },
    { key: 'meetings', label: 'Meetings', goal: goals.meetingsPerDay || 2 }
  ];

  const handleInputChange = (day, metricKey, value) => {
    // Only allow non-negative numbers
    if (value < 0) return;
    
    const newData = {
      ...data,
      [day]: {
        ...data[day],
        [metricKey]: value
      }
    };
    onChange(newData);
  };

  const getDayLabel = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <div className="min-w-[800px] w-full">
      <div className="grid grid-cols-6 gap-0 text-center">
        {/* Header Row */}
        <div className="p-4 font-semibold text-slate-400 border-b border-slate-100">Metric</div>
        {days.map(day => (
          <div key={day} className="p-4 font-semibold text-midnight border-b border-slate-100">
            {getDayLabel(day)}
          </div>
        ))}

        {/* Metric Rows */}
        {metrics.map(metric => (
          <React.Fragment key={metric.key}>
            <div className="p-4 flex flex-col justify-center items-start border-b border-slate-50 bg-slate-50/50">
              <span className="font-medium text-slate-700">{metric.label}</span>
              <span className="text-xs text-slate-400 mt-1">Goal: {metric.goal}</span>
            </div>
            {days.map(day => {
              const rawValue = data[day] ? data[day][metric.key] : '';
              // Convert 0 to empty string for display, keep other values as-is
              const value = rawValue === 0 || rawValue === '0' ? '' : rawValue;
              const isGoalMet = value && parseInt(value) >= metric.goal;
              
              return (
                <div key={`${day}-${metric.key}`} className="p-2 border-b border-slate-50 relative group">
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={value}
                    onChange={(e) => handleInputChange(day, metric.key, e.target.value)}
                    className={`
                      w-full h-12 text-center text-lg rounded-lg border-2 outline-none transition-all
                      ${isGoalMet 
                        ? 'border-emerald/50 bg-emerald/5 text-emerald font-semibold focus:border-emerald' 
                        : 'border-slate-200 focus:border-midnight/50 focus:bg-white bg-white text-slate-700'}
                    `}
                  />
                  {isGoalMet && (
                    <div className="absolute top-3 right-3 text-emerald pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

ActivityGrid.propTypes = {
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  goals: PropTypes.object.isRequired
};

export default ActivityGrid;
