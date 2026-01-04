import * as XLSX from 'xlsx';

export const exportToExcel = (allData, goals, reps) => {
  try {
    const wb = XLSX.utils.book_new();

    // 1. Activity Data Sheet
    const activityData = allData.map(entry => {
      const flatEntry = {
        Rep: entry.rep,
        WeekStart: entry.weekStart,
      };

      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
        if (entry[day]) {
          flatEntry[`${day}_Calls`] = entry[day].calls;
          flatEntry[`${day}_Emails`] = entry[day].emails;
          flatEntry[`${day}_Contacts`] = entry[day].contacts;
          flatEntry[`${day}_Responses`] = entry[day].responses;
          flatEntry[`${day}_Meetings`] = entry[day].meetings;
        }
      });
      return flatEntry;
    });

    const wsActivity = XLSX.utils.json_to_sheet(activityData);
    XLSX.utils.book_append_sheet(wb, wsActivity, "Activity Data");

    // 2. Goals Sheet
    const goalsData = [
      { Metric: "Calls Per Day", Value: goals.callsPerDay },
      { Metric: "Emails Per Day", Value: goals.emailsPerDay },
      { Metric: "Contacts Per Day", Value: goals.contactsPerDay },
      { Metric: "Responses Per Day", Value: goals.responsesPerDay },
      { Metric: "Meetings Per Day", Value: goals.meetingsPerDay },
      { Metric: "Calls Per Week", Value: goals.callsPerWeek },
      { Metric: "Emails Per Week", Value: goals.emailsPerWeek },
      { Metric: "Contacts Per Week", Value: goals.contactsPerWeek },
      { Metric: "Responses Per Week", Value: goals.responsesPerWeek },
      { Metric: "Meetings Per Week", Value: goals.meetingsPerWeek },
    ];
    const wsGoals = XLSX.utils.json_to_sheet(goalsData);
    XLSX.utils.book_append_sheet(wb, wsGoals, "Goals");

    // 3. Summary by Rep (Aggregated)
    const summaryByRep = reps.map(rep => {
      const repData = allData.filter(d => d.rep === rep);

      // Calculate totals for each metric across all weeks
      const totals = repData.reduce((acc, curr) => {
          ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
              if (curr[day]) {
                  acc.calls += parseInt(curr[day].calls || 0, 10);
                  acc.emails += parseInt(curr[day].emails || 0, 10);
                  acc.contacts += parseInt(curr[day].contacts || 0, 10);
                  acc.responses += parseInt(curr[day].responses || 0, 10);
                  acc.meetings += parseInt(curr[day].meetings || 0, 10);
              }
          });
          return acc;
      }, { calls: 0, emails: 0, contacts: 0, responses: 0, meetings: 0 });

      return {
        Rep: rep,
        Total_Weeks: repData.length,
        Total_Calls: totals.calls,
        Total_Emails: totals.emails,
        Total_Contacts: totals.contacts,
        Total_Responses: totals.responses,
        Total_Meetings: totals.meetings
      };
    });

    const wsSummary = XLSX.utils.json_to_sheet(summaryByRep);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary by Rep");

    // Generate filename
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `sales-activity-export-${dateStr}.xlsx`);
    return true;
  } catch (error) {
    console.error("Export failed:", error);
    return false;
  }
};
