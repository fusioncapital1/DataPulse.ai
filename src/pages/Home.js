import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

/**
 * Home page component
 * @returns {React.ReactElement} - Rendered component
 */
const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Transform Web Data into <span className="highlight">Actionable Insights</span>
          </h1>
          <p className="hero-subtitle">
            Extract, monitor, and analyze data from any website without coding using our AI-powered platform.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Get Started Free</Link>
            <a href="#features" className="btn btn-outline">Learn More</a>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/hero-illustration.svg" alt="DataPulse.ai Platform" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">Everything you need to extract and analyze web data</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
                <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
              </svg>
            </div>
            <h3 className="feature-title">Visual Data Extractor</h3>
            <p className="feature-description">
              Point-and-click interface to select and extract data from any website without writing code.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <h3 className="feature-title">Pulse Monitoring</h3>
            <p className="feature-description">
              Track changes to data sources over time and receive alerts when important changes occur.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.29 7 12 12 20.71 7"></polyline>
                <line x1="12" y1="22" x2="12" y2="12"></line>
              </svg>
            </div>
            <h3 className="feature-title">AI Insights Engine</h3>
            <p className="feature-description">
              Automatic pattern detection, anomaly alerts, and predictive analytics powered by AI.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h3 className="feature-title">Template Marketplace</h3>
            <p className="feature-description">
              Share and monetize extraction templates with the community or use pre-built templates.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"></path>
                <path d="M2 20h20"></path>
                <path d="M14 12v.01"></path>
              </svg>
            </div>
            <h3 className="feature-title">Integration Hub</h3>
            <p className="feature-description">
              Connect with popular tools like Google Sheets, Airtable, Notion, and more.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="feature-title">Enterprise Security</h3>
            <p className="feature-description">
              Bank-level encryption, access controls, and compliance with data protection regulations.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Extract data in three simple steps</p>
        </div>

        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3 className="step-title">Select Your Data</h3>
            <p className="step-description">
              Use our visual selector to point and click on the data you want to extract from any website.
            </p>
          </div>

          <div className="step-arrow">→</div>

          <div className="step">
            <div className="step-number">2</div>
            <h3 className="step-title">Create Extraction Rules</h3>
            <p className="step-description">
              Define extraction patterns or use AI to automatically detect and extract structured data.
            </p>
          </div>

          <div className="step-arrow">→</div>

          <div className="step">
            <div className="step-number">3</div>
            <h3 className="step-title">Analyze & Export</h3>
            <p className="step-description">
              Get insights from your data and export to your preferred format or connected tools.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="section-header">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">Choose the plan that fits your needs</p>
        </div>

        <div className="pricing-cards">
          <div className="pricing-card">
            <div className="pricing-header">
              <h3 className="pricing-title">Free</h3>
              <p className="pricing-price">$0<span>/month</span></p>
            </div>
            <ul className="pricing-features">
              <li>5 extractions per day</li>
              <li>Basic data monitoring</li>
              <li>Export to CSV</li>
              <li>Community templates</li>
              <li>Email support</li>
            </ul>
            <Link to="/register" className="btn btn-outline pricing-btn">Get Started</Link>
          </div>

          <div className="pricing-card popular">
            <div className="popular-badge">Most Popular</div>
            <div className="pricing-header">
              <h3 className="pricing-title">Professional</h3>
              <p className="pricing-price">$29<span>/month</span></p>
            </div>
            <ul className="pricing-features">
              <li>Unlimited extractions</li>
              <li>Advanced monitoring</li>
              <li>Export to multiple formats</li>
              <li>AI-powered insights</li>
              <li>API access</li>
              <li>Priority support</li>
            </ul>
            <Link to="/register" className="btn btn-primary pricing-btn">Get Started</Link>
          </div>

          <div className="pricing-card">
            <div className="pricing-header">
              <h3 className="pricing-title">Enterprise</h3>
              <p className="pricing-price">$99<span>/month</span></p>
            </div>
            <ul className="pricing-features">
              <li>Everything in Professional</li>
              <li>Dedicated server resources</li>
              <li>Custom integrations</li>
              <li>Team collaboration</li>
              <li>Advanced security features</li>
              <li>Dedicated account manager</li>
            </ul>
            <Link to="/register" className="btn btn-outline pricing-btn">Contact Sales</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to transform web data into insights?</h2>
          <p className="cta-subtitle">Join thousands of businesses using DataPulse.ai to make data-driven decisions.</p>
          <Link to="/register" className="btn btn-primary cta-btn">Start Your Free Trial</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
