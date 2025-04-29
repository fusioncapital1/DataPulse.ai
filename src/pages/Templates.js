import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../firebase-config';
import { collection, query, where, orderBy, getDocs, doc, deleteDoc } from '@firebase/firestore';
import { formatDate } from '../utils/helpers';
import './Templates.css';

/**
 * Templates page component
 * @returns {React.ReactElement} - Rendered component
 */
const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'my', 'community'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError('');
      
      try {
        const user = auth.currentUser;
        
        if (!user) {
          throw new Error('You must be logged in to view templates');
        }
        
        let templatesQuery;
        
        if (filter === 'all') {
          // Fetch all templates (user's templates + public community templates)
          templatesQuery = query(
            collection(db, 'templates'),
            orderBy('createdAt', 'desc')
          );
        } else if (filter === 'my') {
          // Fetch only user's templates
          templatesQuery = query(
            collection(db, 'templates'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
          );
        } else {
          // Fetch only community templates (excluding user's templates)
          templatesQuery = query(
            collection(db, 'templates'),
            where('isPublic', '==', true),
            where('userId', '!=', user.uid),
            orderBy('createdAt', 'desc')
          );
        }
        
        const querySnapshot = await getDocs(templatesQuery);
        
        const fetchedTemplates = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isOwner: doc.data().userId === user.uid
        }));
        
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error('Fetch templates error:', error);
        setError('Failed to fetch templates: ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTemplates();
  }, [filter]);

  // Filter templates by search term
  const filteredTemplates = templates.filter(template => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      template.name.toLowerCase().includes(term) ||
      (template.description && template.description.toLowerCase().includes(term))
    );
  });

  // Handle template deletion
  const handleDeleteTemplate = async () => {
    if (!selectedTemplate) return;
    
    setDeleteLoading(true);
    
    try {
      await deleteDoc(doc(db, 'templates', selectedTemplate.id));
      
      // Update templates list
      setTemplates(templates.filter(t => t.id !== selectedTemplate.id));
      
      // Close modal
      setShowDeleteModal(false);
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Delete template error:', error);
      setError('Failed to delete template: ' + error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (template) => {
    setSelectedTemplate(template);
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="templates-container">
      <div className="templates-header">
        <h1 className="templates-title">Extraction Templates</h1>
        <p className="templates-subtitle">
          Use pre-built templates or create your own to quickly extract data
        </p>
        <Link to="/extractor" className="btn btn-primary create-template-btn">
          Create New Template
        </Link>
      </div>

      <div className="templates-filters">
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Templates
          </button>
          <button
            className={`filter-tab ${filter === 'my' ? 'active' : ''}`}
            onClick={() => setFilter('my')}
          >
            My Templates
          </button>
          <button
            className={`filter-tab ${filter === 'community' ? 'active' : ''}`}
            onClick={() => setFilter('community')}
          >
            Community Templates
          </button>
        </div>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading templates...</p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="no-templates">
          <div className="no-templates-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <line x1="9" y1="15" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3>No templates found</h3>
          <p>
            {filter === 'my'
              ? "You haven't created any templates yet."
              : filter === 'community'
              ? "No community templates available."
              : "No templates match your search."}
          </p>
          <Link to="/extractor" className="btn btn-primary">
            Create Your First Template
          </Link>
        </div>
      ) : (
        <div className="templates-grid">
          {filteredTemplates.map(template => (
            <div key={template.id} className="template-card">
              <div className="template-header">
                <div className="template-icon">
                  {template.mode === 'ai' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                      <polyline points="3.29 7 12 12 20.71 7"></polyline>
                      <line x1="12" y1="22" x2="12" y2="12"></line>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  )}
                </div>
                <div className="template-actions">
                  {template.isOwner && (
                    <>
                      <button
                        className="template-action-btn edit-btn"
                        title="Edit Template"
                        onClick={() => {/* Navigate to edit template */}}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        className="template-action-btn delete-btn"
                        title="Delete Template"
                        onClick={() => openDeleteModal(template)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"></path>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <h3 className="template-name">{template.name}</h3>
              
              {template.description && (
                <p className="template-description">{template.description}</p>
              )}
              
              <div className="template-meta">
                <div className="template-meta-item">
                  <span className="meta-label">Mode:</span>
                  <span className="meta-value">
                    {template.mode === 'ai' ? 'AI-Powered' : 'Manual Selection'}
                  </span>
                </div>
                <div className="template-meta-item">
                  <span className="meta-label">Created:</span>
                  <span className="meta-value">
                    {formatDate(template.createdAt)}
                  </span>
                </div>
                {template.selectors && (
                  <div className="template-meta-item">
                    <span className="meta-label">Fields:</span>
                    <span className="meta-value">
                      {template.selectors.length}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="template-footer">
                <Link
                  to={`/extractor?templateId=${template.id}`}
                  className="btn btn-primary use-template-btn"
                >
                  Use Template
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Delete Template</h3>
              <button className="modal-close-btn" onClick={closeDeleteModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-content">
              <p>
                Are you sure you want to delete the template "{selectedTemplate?.name}"?
                This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDeleteTemplate}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;
