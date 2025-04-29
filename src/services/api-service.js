/**
 * API Service
 * Handles communication with the backend API
 */

import { auth } from '../firebase-config';

// API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.datapulse.io/v1';

/**
 * Get authentication token for API requests
 * @returns {Promise<string>} - Authentication token
 */
const getAuthToken = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  return await currentUser.getIdToken();
};

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - API response
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    // Get authentication token
    const token = await getAuthToken();
    
    // Set default headers
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    };
    
    // Make the request
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    // Parse and return the response
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Get user profile
 * @returns {Promise<Object>} - User profile
 */
export const getUserProfile = async () => {
  return apiRequest('/user/profile', { method: 'GET' });
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} - Updated user profile
 */
export const updateUserProfile = async (profileData) => {
  return apiRequest('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  });
};

/**
 * Get user subscription
 * @returns {Promise<Object>} - User subscription
 */
export const getUserSubscription = async () => {
  return apiRequest('/user/subscription', { method: 'GET' });
};

/**
 * Create a checkout session for subscription
 * @param {string} planId - Subscription plan ID
 * @returns {Promise<Object>} - Checkout session
 */
export const createCheckoutSession = async (planId) => {
  return apiRequest('/checkout/session', {
    method: 'POST',
    body: JSON.stringify({ planId })
  });
};

/**
 * Get user extractions
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} - Paginated extractions
 */
export const getUserExtractions = async (page = 1, limit = 10) => {
  return apiRequest(`/extractions?page=${page}&limit=${limit}`, { method: 'GET' });
};

/**
 * Get extraction by ID
 * @param {string} extractionId - Extraction ID
 * @returns {Promise<Object>} - Extraction details
 */
export const getExtraction = async (extractionId) => {
  return apiRequest(`/extractions/${extractionId}`, { method: 'GET' });
};

/**
 * Create a new extraction
 * @param {Object} extractionData - Extraction data
 * @returns {Promise<Object>} - Created extraction
 */
export const createExtraction = async (extractionData) => {
  return apiRequest('/extractions', {
    method: 'POST',
    body: JSON.stringify(extractionData)
  });
};

/**
 * Delete an extraction
 * @param {string} extractionId - Extraction ID
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteExtraction = async (extractionId) => {
  return apiRequest(`/extractions/${extractionId}`, { method: 'DELETE' });
};

/**
 * Get user templates
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise<Object>} - Paginated templates
 */
export const getUserTemplates = async (page = 1, limit = 10) => {
  return apiRequest(`/templates?page=${page}&limit=${limit}`, { method: 'GET' });
};

/**
 * Get template by ID
 * @param {string} templateId - Template ID
 * @returns {Promise<Object>} - Template details
 */
export const getTemplate = async (templateId) => {
  return apiRequest(`/templates/${templateId}`, { method: 'GET' });
};

/**
 * Create a new template
 * @param {Object} templateData - Template data
 * @returns {Promise<Object>} - Created template
 */
export const createTemplate = async (templateData) => {
  return apiRequest('/templates', {
    method: 'POST',
    body: JSON.stringify(templateData)
  });
};

/**
 * Update a template
 * @param {string} templateId - Template ID
 * @param {Object} templateData - Updated template data
 * @returns {Promise<Object>} - Updated template
 */
export const updateTemplate = async (templateId, templateData) => {
  return apiRequest(`/templates/${templateId}`, {
    method: 'PUT',
    body: JSON.stringify(templateData)
  });
};

/**
 * Delete a template
 * @param {string} templateId - Template ID
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteTemplate = async (templateId) => {
  return apiRequest(`/templates/${templateId}`, { method: 'DELETE' });
};

// Export all functions
const ApiService = {
  getUserProfile,
  updateUserProfile,
  getUserSubscription,
  createCheckoutSession,
  getUserExtractions,
  getExtraction,
  createExtraction,
  deleteExtraction,
  getUserTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate
};

export default ApiService;
