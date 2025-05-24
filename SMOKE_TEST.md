# DataPulse.ai - Manual Smoke Test Plan

## 1. Introduction

**Purpose:**
This document outlines a manual smoke test plan designed for quick verification of the core functionalities of the DataPulse.ai application. The goal is to ensure that major features are working as expected after a new build or deployment, indicating the application is stable enough for further testing or use.

**Environment:**
It is highly recommended to perform these tests in a dedicated **staging environment**. If a staging environment is unavailable, use a local development environment configured as closely as possible to production settings (e.g., using production-like environment variables for Firebase, Stripe in test mode, etc.).

## 2. Prerequisites for Testing

*   [ ] The DataPulse.ai application is successfully deployed to the chosen testing environment.
*   [ ] Access to user accounts for testing (e.g., pre-existing test accounts) or the ability to register new users.
*   [ ] A list of diverse sample websites (e.g., e-commerce product pages, news articles, blogs) available for data extraction testing. Ensure these sites have clear, selectable elements.
*   [ ] If testing features involving payments (e.g., subscriptions), ensure Stripe is configured in **test mode** and valid Stripe test card details are available.
*   [ ] Familiarity with the application's basic workflow and features.

## 3. Test Cases (High-Level Checklist)

Mark each checkbox as passed `[x]` or failed `[ ]`. Add notes for any failures.

### 3.1. User Authentication

*   [ ] **Register New User (Email/Password):**
    *   Can successfully navigate to the registration page.
    *   Can fill in registration details (email, password).
    *   Can successfully submit the form and create a new user account.
    *   Is automatically logged in or can log in after registration.
*   [ ] **Login with Existing User (Email/Password):**
    *   Can successfully navigate to the login page.
    *   Can log in with valid credentials of an existing user.
    *   Is redirected to the appropriate post-login page (e.g., Dashboard).
*   [ ] **Logout:**
    *   Can successfully log out from an active session.
    *   Is redirected to a public page (e.g., Login or Home page).
*   [ ] **Register/Login with GitHub (Optional - if configured):**
    *   (If GitHub OAuth is set up in the test environment)
    *   Can successfully initiate login/registration via GitHub.
    *   Can authorize the application via the GitHub OAuth flow.
    *   Is successfully logged in/registered and redirected to the application.

### 3.2. Visual Data Extractor (Basic Test)

*   [ ] **Navigate to Extractor:**
    *   Can successfully navigate to the data extraction page/interface.
*   [ ] **Input URL and Load Page:**
    *   Can input a URL of a simple, known website (e.g., a static blog post or a simple product page).
    *   The website content loads within the extractor's interface.
*   [ ] **Select Data Points:**
    *   Can activate the point-and-click selection mode.
    *   Can successfully select at least 3-4 distinct data points on the page (e.g., a title, a price, a paragraph of text, an image URL).
    *   Selections are visually confirmed.
*   [ ] **Save Extraction Setup:**
    *   Can name and save the configured extraction setup.
    *   The saved setup appears in a list of extractions.
*   [ ] **Run Extraction and Verify Data:**
    *   Can trigger the saved extraction to run.
    *   The extraction process completes successfully.
    *   Can view the extracted data.
    *   The extracted data accurately matches the points selected on the source website.

### 3.3. Pulse Monitoring (Basic Test)

*   [ ] **Create Pulse from Saved Extraction:**
    *   Can select a previously saved extraction setup.
    *   Can navigate to an option to create a "Pulse" (monitoring job) for it.
*   [ ] **Configure and Schedule Pulse:**
    *   Can configure the Pulse with a name and a monitoring frequency (e.g., a frequent interval for testing if possible, or verify it's set for future execution).
    *   The Pulse is successfully created and appears in a list of active Pulses.
*   [ ] **Verify Pulse Execution (if feasible):**
    *   (If possible to wait for an automated run or manually trigger it for testing)
    *   Verify that the Pulse runs at its scheduled time or upon manual trigger.
    *   A new data snapshot/result is recorded for the Pulse.
*   [ ] **Detect Data Change (Optional - if test website can be modified):**
    *   If a test website's data can be manually altered:
        *   Change a piece of data on the source website that the Pulse monitors.
        *   Allow the Pulse to run again (or trigger manually).
        *   Verify that the new Pulse run detects and records the changed data.

### 3.4. AI Insights Engine (If Applicable/Testable)

*   [ ] **Trigger/View Basic Insights:**
    *   (This is highly dependent on the AI Insights Engine's implementation and may require specific data conditions.)
    *   If sample data that should trigger insights is available, or if insights are generated after several Pulse runs with varying data:
        *   Navigate to the insights section.
        *   Verify that some basic insights, patterns, or anomaly alerts are displayed (without crashing or showing errors).
    *   *Note: If this is too complex for a quick smoke test, mark as N/A or note limitations.*

### 3.5. Template Usage (Basic Test)

*   [ ] **Use Existing Template:**
    *   (If sample templates are populated, e.g., via `setup-firebase.js`)
    *   Can navigate to a template marketplace or list.
    *   Can select a sample template.
    *   Can use this template to attempt data extraction from a compatible sample website URL.
    *   Verify that data is extracted according to the template's predefined selectors.
*   [ ] **Save Extraction as New Template (Optional):**
    *   After creating a new extraction setup (as in 3.2), attempt to save this setup as a new, user-defined template.
    *   Verify the new template is saved and appears in the user's list of templates.

### 3.6. Account Management (Basic)

*   [ ] **Navigate to Account Page:**
    *   Can successfully navigate to the user's account management page.
*   [ ] **Verify User Information:**
    *   Basic user information (e.g., email, name if applicable) is displayed correctly.
*   [ ] **Check Subscription/Plan Details (If Stripe is testable):**
    *   (If Stripe integration is active and in test mode)
    *   Navigate to the subscription management section.
    *   Verify that current subscription plan details (or options to subscribe) are displayed. (No actual payment needed for a smoke test, just verify the interface loads and shows relevant info).

## 4. General Checks

*   [ ] **No Console Errors:**
    *   Open the browser's developer console.
    *   Navigate through the application's main pages.
    *   Verify no obvious critical errors (e.g., JavaScript runtime errors, failed network requests for essential assets) are logged.
*   [ ] **Navigation:**
    *   All main navigation links (e.g., in header, sidebar) are working.
    *   Can successfully navigate between different sections/pages of the application.
*   [ ] **Responsiveness (Basic Check):**
    *   Resize the browser window to a smaller width (simulating tablet or mobile).
    *   Verify the layout adjusts reasonably and core elements remain usable. (This is a quick check, not full responsiveness testing).

## 5. Notes

*   This smoke test plan is intended for quick, high-level verification. It is **not** a substitute for comprehensive regression testing, usability testing, or performance testing.
*   Any issues, unexpected behavior, or failures encountered during these tests should be documented with clear steps to reproduce, expected vs. actual results, and relevant environment details.
*   If a feature is not testable in the current environment (e.g., GitHub auth not configured), mark it as N/A and note the reason.Okay, I have successfully created the `SMOKE_TEST.md` file in the root of the repository with the detailed manual smoke test plan.

The file includes:
-   An **Introduction** explaining the purpose and recommended testing environment.
-   **Prerequisites for Testing**, listing necessary conditions and resources.
-   **Test Cases (High-Level Checklist)** covering:
    -   User Authentication (Email/Password, GitHub)
    -   Visual Data Extractor (URL input, point-and-click selection, saving, running, verifying data)
    -   Pulse Monitoring (creating from extraction, configuring, verifying execution, detecting changes)
    -   AI Insights Engine (basic verification, acknowledging potential difficulty in a smoke test)
    -   Template Usage (using existing templates, saving new ones)
    -   Account Management (viewing user info, checking subscription details if Stripe is testable)
-   **General Checks** for console errors, navigation, and basic responsiveness.
-   **Notes** emphasizing that this is a smoke test and the importance of recording issues.

Each test item is presented as a checkbox `[ ]` to be easily used as a checklist. The content is structured to be clear, actionable, and comprehensive for a smoke test.
