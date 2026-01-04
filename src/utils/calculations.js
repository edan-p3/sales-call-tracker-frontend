export const calculateWeeklyTotals = (weekData) => {
  const totals = {
    calls: 0,
    emails: 0,
    contacts: 0,
    responses: 0,
    meetings: 0
  };

  if (!weekData) return totals;

  ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
    if (weekData[day]) {
      totals.calls += parseInt(weekData[day].calls || 0, 10);
      totals.emails += parseInt(weekData[day].emails || 0, 10);
      totals.contacts += parseInt(weekData[day].contacts || 0, 10);
      totals.responses += parseInt(weekData[day].responses || 0, 10);
      totals.meetings += parseInt(weekData[day].meetings || 0, 10);
    }
  });

  return totals;
};

export const calculateProgress = (current, goal) => {
  if (!goal || goal === 0) return 0;
  const percentage = (current / goal) * 100;
  return Math.min(percentage, 100); // Cap at 100 for display purposes if needed, or keep for actual calculation
};
