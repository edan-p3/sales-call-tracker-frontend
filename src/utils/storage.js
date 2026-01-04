// Storage keys
const GOALS_KEY = 'tracker-goals';
const REPS_KEY = 'tracker-reps';
const LOGO_KEY = 'tracker-logo';

export const defaultGoals = {
  callsPerDay: 25,
  emailsPerDay: 30,
  contactsPerDay: 10,
  responsesPerDay: 5,
  meetingsPerDay: 2,
  callsPerWeek: 125,
  emailsPerWeek: 150,
  contactsPerWeek: 50,
  responsesPerWeek: 25,
  meetingsPerWeek: 10
};

export const getGoals = () => {
  try {
    const goals = localStorage.getItem(GOALS_KEY);
    return goals ? JSON.parse(goals) : defaultGoals;
  } catch (error) {
    console.error('Error reading goals:', error);
    return defaultGoals;
  }
};

export const saveGoals = (goals) => {
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
    return true;
  } catch (error) {
    console.error('Error saving goals:', error);
    return false;
  }
};

export const getReps = () => {
  try {
    const reps = localStorage.getItem(REPS_KEY);
    return reps ? JSON.parse(reps) : [];
  } catch (error) {
    console.error('Error reading reps:', error);
    return [];
  }
};

export const saveReps = (reps) => {
  try {
    localStorage.setItem(REPS_KEY, JSON.stringify(reps));
    return true;
  } catch (error) {
    console.error('Error saving reps:', error);
    return false;
  }
};

export const getLogo = () => {
  try {
    return localStorage.getItem(LOGO_KEY);
  } catch (error) {
    console.error('Error reading logo:', error);
    return null;
  }
};

export const saveLogo = (logoBase64) => {
  try {
    localStorage.setItem(LOGO_KEY, logoBase64);
    return true;
  } catch (error) {
    console.error('Error saving logo:', error);
    return false;
  }
};


export const getWeekData = (weekStart, repName) => {
  if (!weekStart || !repName) return null;
  const key = `week-${weekStart}-${repName}`;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading week data:', error);
    return null;
  }
};

export const saveWeekData = (weekStart, repName, data) => {
  if (!weekStart || !repName) return false;
  const key = `week-${weekStart}-${repName}`;
  try {
    const dataToSave = {
      weekStart,
      rep: repName,
      ...data
    };
    localStorage.setItem(key, JSON.stringify(dataToSave));
    return true;
  } catch (error) {
    console.error('Error saving week data:', error);
    return false;
  }
};

export const getAllWeekData = () => {
  const allData = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('week-')) {
        const item = localStorage.getItem(key);
        if (item) {
          allData.push(JSON.parse(item));
        }
      }
    }
  } catch (error) {
    console.error('Error reading all data:', error);
  }
  return allData;
};
