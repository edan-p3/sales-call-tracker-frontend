import api from './api';

/**
 * Get all team members for a manager
 */
export const getTeamMembers = async () => {
  try {
    const response = await api.get('/team/members');
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};

/**
 * Get specific team member's goals
 */
export const getTeamMemberGoals = async (userId) => {
  try {
    const response = await api.get(`/team/member/${userId}/goals`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching team member goals:', error);
    throw error;
  }
};

/**
 * Get specific team member's weekly activity
 */
export const getTeamMemberActivity = async (userId, weekStart) => {
  try {
    const response = await api.get(`/team/member/${userId}/activity/${weekStart}`);
    return transformFromAPI(response.data.data);
  } catch (error) {
    if (error.response?.status === 404 || error.response?.data?.data === null) {
      // No data for this week yet
      return null;
    }
    console.error('Error fetching team member activity:', error);
    throw error;
  }
};

/**
 * Save team member's weekly activity (manager editing)
 */
export const saveTeamMemberActivity = async (userId, weekStart, data) => {
  try {
    const apiData = transformToAPI(weekStart, data);
    const response = await api.post(`/team/member/${userId}/activity`, apiData);
    return response.data.success;
  } catch (error) {
    console.error('Error saving team member activity:', error);
    return false;
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

