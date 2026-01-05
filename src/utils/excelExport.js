import * as XLSX from 'xlsx';
import { format } from 'date-fns';

export const exportToExcel = (allData, goals, user) => {
  try {
    if (!allData || allData.length === 0) {
      console.error('No data to export');
      return false;
    }

    const wb = XLSX.utils.book_new();
    
    // Get user name for the export
    const userName = user ? `${user.firstName} ${user.lastName}` : 'User';
    const exportDate = format(new Date(), 'MMM dd, yyyy');

    // === SHEET 1: Weekly Summary ===
    const weeklyData = allData.map(weekEntry => {
      // Calculate totals for the week
      const totals = { calls: 0, emails: 0, contacts: 0, responses: 0, meetings: 0 };
      
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
        if (weekEntry[day]) {
          totals.calls += parseInt(weekEntry[day].calls || 0);
          totals.emails += parseInt(weekEntry[day].emails || 0);
          totals.contacts += parseInt(weekEntry[day].contacts || 0);
          totals.responses += parseInt(weekEntry[day].responses || 0);
          totals.meetings += parseInt(weekEntry[day].meetings || 0);
        }
      });

      return {
        'Week Starting': format(new Date(weekEntry.weekStart), 'MMM dd, yyyy'),
        'Total Calls': totals.calls,
        'Calls Goal': goals.callsPerWeek || 0,
        'Calls %': goals.callsPerWeek ? Math.round((totals.calls / goals.callsPerWeek) * 100) + '%' : 'N/A',
        'Total Emails': totals.emails,
        'Emails Goal': goals.emailsPerWeek || 0,
        'Emails %': goals.emailsPerWeek ? Math.round((totals.emails / goals.emailsPerWeek) * 100) + '%' : 'N/A',
        'Total Contacts': totals.contacts,
        'Contacts Goal': goals.contactsPerWeek || 0,
        'Contacts %': goals.contactsPerWeek ? Math.round((totals.contacts / goals.contactsPerWeek) * 100) + '%' : 'N/A',
        'Total Responses': totals.responses,
        'Responses Goal': goals.responsesPerWeek || 0,
        'Responses %': goals.responsesPerWeek ? Math.round((totals.responses / goals.responsesPerWeek) * 100) + '%' : 'N/A',
        'Total Meetings': totals.meetings,
        'Meetings Goal': goals.meetingsPerWeek || 10,
        'Meetings %': Math.round((totals.meetings / (goals.meetingsPerWeek || 10)) * 100) + '%'
      };
    });

    const wsSummary = XLSX.utils.json_to_sheet(weeklyData);
    
    // Set column widths for summary sheet
    wsSummary['!cols'] = [
      { wch: 18 }, // Week Starting
      { wch: 12 }, // Total Calls
      { wch: 12 }, // Calls Goal
      { wch: 10 }, // Calls %
      { wch: 12 }, // Total Emails
      { wch: 12 }, // Emails Goal
      { wch: 10 }, // Emails %
      { wch: 14 }, // Total Contacts
      { wch: 14 }, // Contacts Goal
      { wch: 12 }, // Contacts %
      { wch: 15 }, // Total Responses
      { wch: 15 }, // Responses Goal
      { wch: 13 }, // Responses %
      { wch: 15 }, // Total Meetings
      { wch: 13 }, // Meetings Goal
      { wch: 12 }  // Meetings %
    ];

    XLSX.utils.book_append_sheet(wb, wsSummary, "Weekly Summary");

    // === SHEET 2: Daily Breakdown (Each Week) ===
    allData.forEach((weekEntry, index) => {
      const weekStart = format(new Date(weekEntry.weekStart), 'MMM dd');
      
      // Calculate week totals first
      const weekTotals = {
        calls: 0,
        emails: 0,
        contacts: 0,
        responses: 0,
        meetings: 0
      };

      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
        if (weekEntry[day]) {
          weekTotals.calls += parseInt(weekEntry[day].calls || 0);
          weekTotals.emails += parseInt(weekEntry[day].emails || 0);
          weekTotals.contacts += parseInt(weekEntry[day].contacts || 0);
          weekTotals.responses += parseInt(weekEntry[day].responses || 0);
          weekTotals.meetings += parseInt(weekEntry[day].meetings || 0);
        }
      });
      
      const dailyData = [
        {
          Day: 'Monday',
          Calls: weekEntry.monday?.calls || 0,
          Emails: weekEntry.monday?.emails || 0,
          Contacts: weekEntry.monday?.contacts || 0,
          Responses: weekEntry.monday?.responses || 0,
          Meetings: weekEntry.monday?.meetings || 0
        },
        {
          Day: 'Tuesday',
          Calls: weekEntry.tuesday?.calls || 0,
          Emails: weekEntry.tuesday?.emails || 0,
          Contacts: weekEntry.tuesday?.contacts || 0,
          Responses: weekEntry.tuesday?.responses || 0,
          Meetings: weekEntry.tuesday?.meetings || 0
        },
        {
          Day: 'Wednesday',
          Calls: weekEntry.wednesday?.calls || 0,
          Emails: weekEntry.wednesday?.emails || 0,
          Contacts: weekEntry.wednesday?.contacts || 0,
          Responses: weekEntry.wednesday?.responses || 0,
          Meetings: weekEntry.wednesday?.meetings || 0
        },
        {
          Day: 'Thursday',
          Calls: weekEntry.thursday?.calls || 0,
          Emails: weekEntry.thursday?.emails || 0,
          Contacts: weekEntry.thursday?.contacts || 0,
          Responses: weekEntry.thursday?.responses || 0,
          Meetings: weekEntry.thursday?.meetings || 0
        },
        {
          Day: 'Friday',
          Calls: weekEntry.friday?.calls || 0,
          Emails: weekEntry.friday?.emails || 0,
          Contacts: weekEntry.friday?.contacts || 0,
          Responses: weekEntry.friday?.responses || 0,
          Meetings: weekEntry.friday?.meetings || 0
        },
        {
          Day: '',
          Calls: '',
          Emails: '',
          Contacts: '',
          Responses: '',
          Meetings: ''
        },
        {
          Day: 'WEEK TOTAL',
          Calls: weekTotals.calls,
          Emails: weekTotals.emails,
          Contacts: weekTotals.contacts,
          Responses: weekTotals.responses,
          Meetings: weekTotals.meetings
        },
        {
          Day: 'DAILY GOAL',
          Calls: goals.callsPerDay || 0,
          Emails: goals.emailsPerDay || 0,
          Contacts: goals.contactsPerDay || 0,
          Responses: goals.responsesPerDay || 0,
          Meetings: goals.meetingsPerDay || 2
        }
      ];

      const wsDaily = XLSX.utils.json_to_sheet(dailyData);
      
      // Set column widths
      wsDaily['!cols'] = [
        { wch: 15 },
        { wch: 10 },
        { wch: 10 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 }
      ];

      // Limit sheet name to 31 chars (Excel limit)
      const sheetName = `Week ${weekStart}`.substring(0, 31);
      XLSX.utils.book_append_sheet(wb, wsDaily, sheetName);
    });

    // === SHEET 3: Goals Reference ===
    const goalsData = [
      { Metric: 'Calls per Day', Goal: goals.callsPerDay || 0 },
      { Metric: 'Emails per Day', Goal: goals.emailsPerDay || 0 },
      { Metric: 'Contacts per Day', Goal: goals.contactsPerDay || 0 },
      { Metric: 'Responses per Day', Goal: goals.responsesPerDay || 0 },
      { Metric: 'Meetings per Day', Goal: goals.meetingsPerDay || 2 },
      { Metric: '', Goal: '' },
      { Metric: 'Calls per Week', Goal: goals.callsPerWeek || 0 },
      { Metric: 'Emails per Week', Goal: goals.emailsPerWeek || 0 },
      { Metric: 'Contacts per Week', Goal: goals.contactsPerWeek || 0 },
      { Metric: 'Responses per Week', Goal: goals.responsesPerWeek || 0 },
      { Metric: 'Meetings per Week', Goal: goals.meetingsPerWeek || 10 }
    ];

    const wsGoals = XLSX.utils.json_to_sheet(goalsData);
    wsGoals['!cols'] = [{ wch: 20 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, wsGoals, "Goals");

    // Generate filename
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const filename = `Sales-Activity-${userName.replace(/\s+/g, '-')}-${dateStr}.xlsx`;
    
    XLSX.writeFile(wb, filename);
    return true;
  } catch (error) {
    console.error("Export failed:", error);
    return false;
  }
};
