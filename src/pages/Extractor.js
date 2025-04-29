import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FirecrawlService from '../services/firecrawl-service';
import { auth, db } from '../firebase-config';
import { doc, updateDoc, increment } from '@firebase/firestore';
import { isValidUrl } from '../utils/helpers';
import './Extractor.css';

/**
 * Extractor page component
 * @returns {React.ReactElement} - Rendered component
 */
const Extractor = () => {
  const [url, setUrl] = useState('');
  const [selectors, setSelectors] = useState([{ name: '', selector: '', attribute: '' }]);
  const [extractionName, setExtractionName] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState('');
  const [credits, setCredits] = useState(0);
  const [step, setStep] = useState(1);
  const [extractionMode, setExtractionMode] = useState('manual'); // 'manual' or 'ai'
  const [aiPrompt, setAiPrompt] = useState('');
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  
  const navigate = useNavigate();

  // Fetch user credits
  useEffect(() => {
    const fetchUserCredits = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await db.getDoc(userRef);
          if (userDoc.exists()) {
            setCredits(userDoc.data().credits || 0);
          }
        }
      } catch (error) {
        console.error('Error fetching user credits:', error);
      }
    };

    fetchUserCredits();
  }, []);

  // Add a new selector field
  const addSelector = () => {
    setSelectors([...selectors, { name: '', selector: '', attribute: '' }]);
  };

  // Remove a selector field
  const removeSelector = (index) => {
    const newSelectors = [...selectors];
    newSelectors.splice(index, 1);
    setSelectors(newSelectors);
  };

  // Update a selector field
  const updateSelector = (index, field, value) => {
    const newSelectors = [...selectors];
    newSelectors[index][field] = value;
    setSelectors(newSelectors);
  };

  // Preview extraction
  const previewExtraction = async () => {
    setError('');
    setPreviewData(null);
    
    // Validate URL
    if (!isValidUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }
    
    // Validate selectors in manual mode
    if (extractionMode === 'manual') {
      // Check if at least one selector is provided
      if (selectors.length === 0) {
        setError('Please add at least one selector');
        return;
      }
      
      // Check if all selectors have name and selector
      const invalidSelector = selectors.find(s => !s.name || !s.selector);
      if (invalidSelector) {
        setError('Please fill in all selector fields');
        return;
      }
    } else {
      // Validate AI prompt
      if (!aiPrompt.trim()) {
        setError('Please enter an AI prompt');
        return;
      }
    }
    
    setLoading(true);
    
    try {
      let data;
      
      if (extractionMode === 'manual') {
        // Format selectors for API
        const formattedSelectors = {};
        selectors.forEach(s => {
          formattedSelectors[s.name] = {
            selector: s.selector,
            attribute: s.attribute || 'text'
          };
        });
        
        // Call Firecrawl service
        data = await FirecrawlService.extractData(url, formattedSelectors);
      } else {
        // Call Firecrawl service with AI prompt
        data = await FirecrawlService.extractData(url, {}, {
          useAI: true,
          aiPrompt: aiPrompt
        });
      }
      
      setPreviewData(data);
      
      // Move to next step
      setStep(2);
    } catch (error) {
      console.error('Extraction preview error:', error);
      setError('Failed to preview extraction: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Save extraction
  const saveExtraction = async () => {
    setError('');
    
    // Validate extraction name
    if (!extractionName.trim()) {
      setError('Please enter a name for this extraction');
      return;
    }
    
    // Check if user has enough credits
    if (credits <= 0) {
      setError('You do not have enough credits for this extraction');
      return;
    }
    
    setLoading(true);
    
    try {
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('You must be logged in to save extractions');
      }
      
      // Format extraction data
      const extractionData = {
        name: extractionName,
        url,
        selectors: extractionMode === 'manual' ? selectors : [],
        aiPrompt: extractionMode === 'ai' ? aiPrompt : '',
        mode: extractionMode,
        data: previewData,
        createdAt: new Date().toISOString(),
        userId: user.uid
      };
      
      // Save extraction to database
      // In a real app, you would call your API service here
      // For now, we'll simulate saving to Firestore
      const extractionRef = await db.collection('extractions').add(extractionData);
      
      // Decrement user credits
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        credits: increment(-1)
      });
      
      // Update local credits count
      setCredits(credits - 1);
      
      // Save as template if selected
      if (saveAsTemplate) {
        if (!templateName.trim()) {
          throw new Error('Please enter a name for the template');
        }
        
        const templateData = {
          name: templateName,
          description: templateDescription,
          selectors: extractionMode === 'manual' ? selectors : [],
          aiPrompt: extractionMode === 'ai' ? aiPrompt : '',
          mode: extractionMode,
          createdAt: new Date().toISOString(),
          userId: user.uid
        };
        
        await db.collection('templates').add(templateData);
      }
      
      // Navigate to extraction details
      navigate(`/extractions/${extractionRef.id}`);
    } catch (error) {
      console.error('Save extraction error:', error);
      setError('Failed to save extraction: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="extractor-container">
      <div className="extractor-header">
        <h1 className="extractor-title">Data Extractor</h1>
        <p className="extractor-subtitle">
          Extract structured data from any website using our visual selector or AI
        </p>
        <div className="credits-badge">
          <span className="credits-icon">💎</span>
          <span className="credits-count">{credits} credits</span>
        </div>
      </div>

      {step === 1 && (
        <div className="extraction-setup">
          <div className="extraction-modes">
            <div 
              className={`extraction-mode ${extractionMode === 'manual' ? 'active' : ''}`}
              onClick={() => setExtractionMode('manual')}
            >
              <div className="mode-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </div>
              <h3>Manual Selection</h3>
              <p>Manually define CSS selectors for precise data extraction</p>
            </div>
            
            <div 
              className={`extraction-mode ${extractionMode === 'ai' ? 'active' : ''}`}
              onClick={() => setExtractionMode('ai')}
            >
              <div className="mode-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.29 7 12 12 20.71 7"></polyline>
                  <line x1="12" y1="22" x2="12" y2="12"></line>
                </svg>
              </div>
              <h3>AI-Powered</h3>
              <p>Describe what data you want to extract in natural language</p>
            </div>
          </div>

          <div className="url-input-container">
            <label htmlFor="url">Website URL</label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>

          {extractionMode === 'manual' ? (
            <div className="selectors-container">
              <div className="selectors-header">
                <h3>CSS Selectors</h3>
                <button type="button" className="add-selector-btn" onClick={addSelector}>
                  Add Selector
                </button>
              </div>
              
              {selectors.map((selector, index) => (
                <div key={index} className="selector-row">
                  <div className="selector-field">
                    <label htmlFor={`name-${index}`}>Field Name</label>
                    <input
                      type="text"
                      id={`name-${index}`}
                      value={selector.name}
                      onChange={(e) => updateSelector(index, 'name', e.target.value)}
                      placeholder="e.g., title"
                    />
                  </div>
                  
                  <div className="selector-field">
                    <label htmlFor={`selector-${index}`}>CSS Selector</label>
                    <input
                      type="text"
                      id={`selector-${index}`}
                      value={selector.selector}
                      onChange={(e) => updateSelector(index, 'selector', e.target.value)}
                      placeholder="e.g., h1.title"
                    />
                  </div>
                  
                  <div className="selector-field">
                    <label htmlFor={`attribute-${index}`}>Attribute (optional)</label>
                    <input
                      type="text"
                      id={`attribute-${index}`}
                      value={selector.attribute}
                      onChange={(e) => updateSelector(index, 'attribute', e.target.value)}
                      placeholder="e.g., href (leave empty for text)"
                    />
                  </div>
                  
                  <button
                    type="button"
                    className="remove-selector-btn"
                    onClick={() => removeSelector(index)}
                    disabled={selectors.length === 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="ai-prompt-container">
              <label htmlFor="ai-prompt">Describe what data you want to extract</label>
              <textarea
                id="ai-prompt"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g., Extract product names, prices, and image URLs from this e-commerce page"
                rows={5}
              />
              <p className="ai-prompt-help">
                Be specific about what data you want to extract. The more details you provide, the better the results.
              </p>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="extraction-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={previewExtraction}
              disabled={loading}
            >
              {loading ? 'Extracting...' : 'Preview Extraction'}
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="extraction-preview">
          <div className="preview-header">
            <h3>Extraction Preview</h3>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setStep(1)}
            >
              Back to Editor
            </button>
          </div>

          <div className="preview-data">
            {previewData ? (
              <>
                <div className="data-summary">
                  <div className="summary-item">
                    <span className="summary-label">URL:</span>
                    <span className="summary-value">{url}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Fields:</span>
                    <span className="summary-value">
                      {extractionMode === 'manual'
                        ? selectors.map(s => s.name).join(', ')
                        : Object.keys(previewData).join(', ')}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Records:</span>
                    <span className="summary-value">
                      {Array.isArray(previewData)
                        ? previewData.length
                        : '1'}
                    </span>
                  </div>
                </div>

                <div className="data-viewer">
                  <pre>{JSON.stringify(previewData, null, 2)}</pre>
                </div>
              </>
            ) : (
              <div className="no-data">No data available</div>
            )}
          </div>

          <div className="save-extraction">
            <div className="form-group">
              <label htmlFor="extraction-name">Extraction Name</label>
              <input
                type="text"
                id="extraction-name"
                value={extractionName}
                onChange={(e) => setExtractionName(e.target.value)}
                placeholder="Give this extraction a name"
                required
              />
            </div>

            <div className="save-template-option">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={saveAsTemplate}
                  onChange={(e) => setSaveAsTemplate(e.target.checked)}
                />
                Save as template for future use
              </label>
            </div>

            {saveAsTemplate && (
              <div className="template-details">
                <div className="form-group">
                  <label htmlFor="template-name">Template Name</label>
                  <input
                    type="text"
                    id="template-name"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Give this template a name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="template-description">Template Description</label>
                  <textarea
                    id="template-description"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    placeholder="Describe what this template is for"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            <div className="extraction-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={saveExtraction}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Extraction'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Extractor;
