import api from './api';

// Default goals structure
export const defaultGoals = {
  callsPerDay: 25,
  emailsPerDay: 30,
  contactsPerDay: 10,
  responsesPerDay: 5,
  callsPerWeek: 125,
  emailsPerWeek: 150,
  contactsPerWeek: 50,
  responsesPerWeek: 25
};

/**
 * Get user's goals from API
 */
export const getGoals = async () => {
  try {
    const response = await api.get('/goals');
    return response.data.data || defaultGoals;
  } catch (error) {
    console.error('Error fetching goals:', error);
    return defaultGoals;
  }
};

/**
 * Save goals to API
 */
export const saveGoals = async (goals) => {
  try {
    const response = await api.put('/goals', goals);
    return response.data.data;
  } catch (error) {
    console.error('Error saving goals:', error);
    throw error;
  }
};

/**
 * Get week data for current user
 */
export const getWeekData = async (weekStart) => {
  if (!weekStart) return null;
  try {
    const response = await api.get(`/activity/week/${weekStart}`);
    return transformFromAPI(response.data.data);
  } catch (error) {
    if (error.response?.status === 404 || error.response?.data?.data === null) {
      // No data for this week yet
      return null;
    }
    console.error('Error fetching week data:', error);
    return null;
  }
};

/**
 * Save week data to API
 */
export const saveWeekData = async (weekStart, data) => {
  if (!weekStart) return false;
  try {
    const apiData = transformToAPI(weekStart, data);
    const response = await api.post('/activity/week', apiData);
    return response.data.success;
  } catch (error) {
    console.error('Error saving week data:', error);
    return false;
  }
};

/**
 * Get all week data for export
 */
export const getAllWeekData = async () => {
  try {
    const response = await api.get('/activity/all');
    return (response.data.data || []).map(transformFromAPI);
  } catch (error) {
    console.error('Error fetching all data:', error);
    return [];
  }
};

/**
 * Transform API response to frontend format
 */
const transformFromAPI = (apiData) => {
  if (!apiData) return null;
  
  return {
    weekStart: apiData.weekStartDate,
    monday: apiData.monday || { calls: '', emails: '', contacts: '', responses: '' },
    tuesday: apiData.tuesday || { calls: '', emails: '', contacts: '', responses: '' },
    wednesday: apiData.wednesday || { calls: '', emails: '', contacts: '', responses: '' },
    thursday: apiData.thursday || { calls: '', emails: '', contacts: '', responses: '' },
    friday: apiData.friday || { calls: '', emails: '', contacts: '', responses: '' },
  };
};

/**
 * Transform frontend data to API format
 */
const transformToAPI = (weekStart, data) => {
  const convertToNumber = (value) => {
    const num = parseInt(value, 10);
    return isNaN(num) || value === '' ? 0 : num;
  };

  return {
    weekStartDate: weekStart,
    monday: {
      calls: convertToNumber(data.monday?.calls),
      emails: convertToNumber(data.monday?.emails),
      contacts: convertToNumber(data.monday?.contacts),
      responses: convertToNumber(data.monday?.responses),
    },
    tuesday: {
      calls: convertToNumber(data.tuesday?.calls),
      emails: convertToNumber(data.tuesday?.emails),
      contacts: convertToNumber(data.tuesday?.contacts),
      responses: convertToNumber(data.tuesday?.responses),
    },
    wednesday: {
      calls: convertToNumber(data.wednesday?.calls),
      emails: convertToNumber(data.wednesday?.emails),
      contacts: convertToNumber(data.wednesday?.contacts),
      responses: convertToNumber(data.wednesday?.responses),
    },
    thursday: {
      calls: convertToNumber(data.thursday?.calls),
      emails: convertToNumber(data.thursday?.emails),
      contacts: convertToNumber(data.thursday?.contacts),
      responses: convertToNumber(data.thursday?.responses),
    },
    friday: {
      calls: convertToNumber(data.friday?.calls),
      emails: convertToNumber(data.friday?.emails),
      contacts: convertToNumber(data.friday?.contacts),
      responses: convertToNumber(data.friday?.responses),
    },
  };
};

// Logo storage still uses localStorage (not user-specific)
const LOGO_KEY = 'tracker-logo';

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

// Reps are removed - now uses logged-in user
export const getReps = () => {
  return [];
};

export const saveReps = () => {
  return true;
};

