/**
 * Firecrawl Integration Service
 * Handles communication with the Firecrawl API for data extraction
 */

// Firecrawl API key (replace with your actual key)
const FIRECRAWL_API_KEY = 'fc-e72d5fa25212477989370625258811c8';
const FIRECRAWL_API_URL = 'https://api.firecrawl.dev/v1';

/**
 * Extract data from a website using Firecrawl
 * @param {string} url - The URL to extract data from
 * @param {Object} selectors - CSS selectors for data extraction
 * @param {Object} options - Additional extraction options
 * @returns {Promise<Object>} - Extracted data
 */
export const extractData = async (url, selectors, options = {}) => {
  try {
    const response = await fetch(`${FIRECRAWL_API_URL}/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        url,
        selectors,
        ...options
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to extract data');
    }

    return await response.json();
  } catch (error) {
    console.error('Firecrawl extraction error:', error);
    throw error;
  }
};

/**
 * Create a monitoring job for a website
 * @param {string} name - Name of the monitoring job
 * @param {string} url - The URL to monitor
 * @param {Object} selectors - CSS selectors for data extraction
 * @param {string} frequency - Monitoring frequency (hourly, daily, weekly)
 * @param {Object} options - Additional monitoring options
 * @returns {Promise<Object>} - Created monitoring job
 */
export const createMonitor = async (name, url, selectors, frequency, options = {}) => {
  try {
    const response = await fetch(`${FIRECRAWL_API_URL}/monitors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        name,
        url,
        selectors,
        frequency,
        ...options
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create monitor');
    }

    return await response.json();
  } catch (error) {
    console.error('Firecrawl monitor creation error:', error);
    throw error;
  }
};

/**
 * Get all monitoring jobs
 * @returns {Promise<Array>} - List of monitoring jobs
 */
export const getMonitors = async () => {
  try {
    const response = await fetch(`${FIRECRAWL_API_URL}/monitors`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get monitors');
    }

    return await response.json();
  } catch (error) {
    console.error('Firecrawl get monitors error:', error);
    throw error;
  }
};

/**
 * Get monitoring job results
 * @param {string} monitorId - ID of the monitoring job
 * @returns {Promise<Array>} - List of monitoring results
 */
export const getMonitorResults = async (monitorId) => {
  try {
    const response = await fetch(`${FIRECRAWL_API_URL}/monitors/${monitorId}/results`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get monitor results');
    }

    return await response.json();
  } catch (error) {
    console.error('Firecrawl get monitor results error:', error);
    throw error;
  }
};

/**
 * Delete a monitoring job
 * @param {string} monitorId - ID of the monitoring job to delete
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteMonitor = async (monitorId) => {
  try {
    const response = await fetch(`${FIRECRAWL_API_URL}/monitors/${monitorId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete monitor');
    }

    return await response.json();
  } catch (error) {
    console.error('Firecrawl delete monitor error:', error);
    throw error;
  }
};

/**
 * Generate AI insights from extracted data
 * @param {Object} data - Extracted data to analyze
 * @param {Object} options - Analysis options
 * @returns {Promise<Object>} - AI insights
 */
export const generateInsights = async (data, options = {}) => {
  try {
    const response = await fetch(`${FIRECRAWL_API_URL}/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        data,
        ...options
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate insights');
    }

    return await response.json();
  } catch (error) {
    console.error('Firecrawl insights error:', error);
    throw error;
  }
};

/**
 * Create a data extraction template
 * @param {string} name - Template name
 * @param {string} description - Template description
 * @param {Object} selectors - CSS selectors for data extraction
 * @param {Object} options - Additional template options
 * @returns {Promise<Object>} - Created template
 */
export const createTemplate = async (name, description, selectors, options = {}) => {
  try {
    const response = await fetch(`${FIRECRAWL_API_URL}/templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      },
      body: JSON.stringify({
        name,
        description,
        selectors,
        ...options
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create template');
    }

    return await response.json();
  } catch (error) {
    console.error('Firecrawl template creation error:', error);
    throw error;
  }
};

/**
 * Get all templates
 * @returns {Promise<Array>} - List of templates
 */
export const getTemplates = async () => {
  try {
    const response = await fetch(`${FIRECRAWL_API_URL}/templates`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get templates');
    }

    return await response.json();
  } catch (error) {
    console.error('Firecrawl get templates error:', error);
    throw error;
  }
};

// Export all functions
const FirecrawlService = {
  extractData,
  createMonitor,
  getMonitors,
  getMonitorResults,
  deleteMonitor,
  generateInsights,
  createTemplate,
  getTemplates
};

export default FirecrawlService;
