import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { collection, query, where, orderBy, getDocs } from '@firebase/firestore';
import FirecrawlService from '../services/firecrawl-service';
import { formatDate } from '../utils/helpers';
import './Insights.css';

/**
 * Insights page component
 * @returns {React.ReactElement} - Rendered component
 */
const Insights = () => {
  const [extractions, setExtractions] = useState([]);
  const [selectedExtraction, setSelectedExtraction] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [insightLoading, setInsightLoading] = useState(false);
  const [error, setError] = useState('');
  const [insightError, setInsightError] = useState('');
  const [insightType, setInsightType] = useState('summary'); // 'summary', 'trends', 'anomalies'

  // Fetch user extractions
  useEffect(() => {
    const fetchExtractions = async () => {
      setLoading(true);
      setError('');
      
      try {
        const user = auth.currentUser;
        
        if (!user) {
          throw new Error('You must be logged in to view insights');
        }
        
        // Query extractions
        const extractionsQuery = query(
          collection(db, 'extractions'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(extractionsQuery);
        
        const fetchedExtractions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setExtractions(fetchedExtractions);
        
        // Select the first extraction by default
        if (fetchedExtractions.length > 0 && !selectedExtraction) {
          setSelectedExtraction(fetchedExtractions[0]);
        }
      } catch (error) {
        console.error('Fetch extractions error:', error);
        setError('Failed to fetch extractions: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExtractions();
  }, [selectedExtraction]);

  // Generate insights when extraction or insight type changes
  useEffect(() => {
    if (selectedExtraction) {
      generateInsights();
    }
  }, [selectedExtraction, insightType]);

  // Generate insights for the selected extraction
  const generateInsights = async () => {
    if (!selectedExtraction) return;
    
    setInsightLoading(true);
    setInsightError('');
    setInsights(null);
    
    try {
      // Call Firecrawl service to generate insights
      const insightData = await FirecrawlService.generateInsights(
        selectedExtraction.data,
        { type: insightType }
      );
      
      setInsights(insightData);
    } catch (error) {
      console.error('Generate insights error:', error);
      setInsightError('Failed to generate insights: ' + error.message);
    } finally {
      setInsightLoading(false);
    }
  };

  // Handle extraction selection
  const handleExtractionSelect = (extraction) => {
    setSelectedExtraction(extraction);
  };

  return (
    <div className="insights-container">
      <div className="insights-header">
        <h1 className="insights-title">AI Insights</h1>
        <p className="insights-subtitle">
          Get AI-powered insights from your extracted data
        </p>
      </div>

      {error ? (
        <div className="error-message">{error}</div>
      ) : loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading extractions...</p>
        </div>
      ) : extractions.length === 0 ? (
        <div className="no-extractions">
          <div className="no-extractions-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
            </svg>
          </div>
          <h3>No extractions found</h3>
          <p>You need to extract data before generating insights.</p>
          <a href="/extractor" className="btn btn-primary">
            Create Your First Extraction
          </a>
        </div>
      ) : (
        <div className="insights-content">
          <div className="extractions-sidebar">
            <h3 className="sidebar-title">Your Extractions</h3>
            <div className="extractions-list">
              {extractions.map(extraction => (
                <div
                  key={extraction.id}
                  className={`extraction-item ${selectedExtraction?.id === extraction.id ? 'active' : ''}`}
                  onClick={() => handleExtractionSelect(extraction)}
                >
                  <div className="extraction-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
                    </svg>
                  </div>
                  <div className="extraction-details">
                    <h4 className="extraction-name">{extraction.name}</h4>
                    <p className="extraction-date">{formatDate(extraction.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="insights-main">
            {selectedExtraction ? (
              <>
                <div className="insights-extraction-header">
                  <h2 className="extraction-title">{selectedExtraction.name}</h2>
                  <p className="extraction-url">{selectedExtraction.url}</p>
                </div>
                
                <div className="insight-types">
                  <button
                    className={`insight-type-btn ${insightType === 'summary' ? 'active' : ''}`}
                    onClick={() => setInsightType('summary')}
                  >
                    Summary
                  </button>
                  <button
                    className={`insight-type-btn ${insightType === 'trends' ? 'active' : ''}`}
                    onClick={() => setInsightType('trends')}
                  >
                    Trends
                  </button>
                  <button
                    className={`insight-type-btn ${insightType === 'anomalies' ? 'active' : ''}`}
                    onClick={() => setInsightType('anomalies')}
                  >
                    Anomalies
                  </button>
                </div>
                
                <div className="insights-panel">
                  {insightLoading ? (
                    <div className="insight-loading">
                      <div className="loading-spinner"></div>
                      <p>Generating insights...</p>
                    </div>
                  ) : insightError ? (
                    <div className="insight-error">
                      <p>{insightError}</p>
                      <button
                        className="btn btn-primary retry-btn"
                        onClick={generateInsights}
                      >
                        Retry
                      </button>
                    </div>
                  ) : insights ? (
                    <div className="insight-content">
                      {insightType === 'summary' && (
                        <div className="insight-summary">
                          <h3 className="insight-section-title">Data Summary</h3>
                          <div className="summary-stats">
                            <div className="summary-stat">
                              <div className="stat-value">{insights.recordCount || 0}</div>
                              <div className="stat-label">Records</div>
                            </div>
                            <div className="summary-stat">
                              <div className="stat-value">{insights.fieldCount || 0}</div>
                              <div className="stat-label">Fields</div>
                            </div>
                            <div className="summary-stat">
                              <div className="stat-value">{insights.completeness || '0%'}</div>
                              <div className="stat-label">Completeness</div>
                            </div>
                          </div>
                          
                          <div className="summary-text">
                            <h4>Key Findings</h4>
                            <p>{insights.summary}</p>
                          </div>
                          
                          {insights.recommendations && (
                            <div className="recommendations">
                              <h4>Recommendations</h4>
                              <ul>
                                {insights.recommendations.map((rec, index) => (
                                  <li key={index}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {insightType === 'trends' && (
                        <div className="insight-trends">
                          <h3 className="insight-section-title">Data Trends</h3>
                          
                          {insights.trends && insights.trends.length > 0 ? (
                            <div className="trends-list">
                              {insights.trends.map((trend, index) => (
                                <div key={index} className="trend-item">
                                  <h4>{trend.title}</h4>
                                  <p>{trend.description}</p>
                                  {trend.value && (
                                    <div className="trend-value">
                                      <span className="trend-label">Value:</span>
                                      <span className="trend-number">{trend.value}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="no-insights-message">
                              No significant trends detected in this data.
                            </p>
                          )}
                        </div>
                      )}
                      
                      {insightType === 'anomalies' && (
                        <div className="insight-anomalies">
                          <h3 className="insight-section-title">Data Anomalies</h3>
                          
                          {insights.anomalies && insights.anomalies.length > 0 ? (
                            <div className="anomalies-list">
                              {insights.anomalies.map((anomaly, index) => (
                                <div key={index} className="anomaly-item">
                                  <div className="anomaly-header">
                                    <h4>{anomaly.title}</h4>
                                    <span className={`anomaly-severity ${anomaly.severity}`}>
                                      {anomaly.severity}
                                    </span>
                                  </div>
                                  <p>{anomaly.description}</p>
                                  {anomaly.location && (
                                    <div className="anomaly-location">
                                      <span className="location-label">Location:</span>
                                      <span className="location-value">{anomaly.location}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="no-insights-message">
                              No anomalies detected in this data.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="no-insights">
                      <p>Select an extraction and insight type to generate insights.</p>
                      <button
                        className="btn btn-primary"
                        onClick={generateInsights}
                      >
                        Generate Insights
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="no-extraction-selected">
                <p>Select an extraction to view insights.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
