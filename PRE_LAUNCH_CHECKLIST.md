# DataPulse.ai - Pre-Launch Checklist

## Introduction

**Purpose:**
This checklist provides a final set of manual verification steps to ensure all critical items are addressed before the public launch of DataPulse.ai. It is crucial to review each item thoroughly to minimize potential issues and ensure a smooth go-live.

**Instructions:**
Mark each checkbox as completed `[x]`. Add notes where necessary. Do not proceed with the launch until all critical items are verified and signed off.

---

## Checklist Items

### I. Environment & Configuration

*   [ ] **Production Environment Secrets (GitHub Actions):**
    *   [ ] `PRODUCTION_FIREBASE_PROJECT_ID` is set and correct in GitHub repository secrets.
    *   [ ] `FIREBASE_TOKEN` is set, correct, has appropriate permissions (e.g., Firebase Admin) for the production Firebase project, and is securely stored as a GitHub secret.
    *   [ ] All `REACT_APP_*` variables required for the production build (as documented in `ENVIRONMENT_CONFIG.md`, e.g., `PROD_FIREBASE_API_KEY`, `PROD_FIRECRAWL_API_KEY`, `PROD_STRIPE_PUBLISHABLE_KEY`, etc.) are correctly set as GitHub repository secrets.
*   [ ] **CI/CD Pipeline (`.github/workflows/ci.yml`):**
    *   [ ] The build step in the CI/CD workflow correctly sources and uses the production `REACT_APP_*` secrets from GitHub Actions secrets to build the application (verify the `env` block in the build job, as exemplified in `ENVIRONMENT_CONFIG.md`).
    *   [ ] Linting (`npm run lint`) and tests (`npm test`) are configured to fail the build if errors occur (i.e., no `|| true` is present in these script commands in the workflow file).
    *   [ ] The deployment step correctly targets the production Firebase project using `secrets.PRODUCTION_FIREBASE_PROJECT_ID`.
*   [ ] **`ENVIRONMENT_CONFIG.md`**:
    *   [ ] The document has been reviewed and is understood by the team responsible for deployment and environment setup.
    *   [ ] All variables listed in `ENVIRONMENT_CONFIG.md` are accounted for in the production environment secrets.

### II. Backend & Security

*   [ ] **Firebase Project (Production Instance):**
    *   [ ] The correct Firebase project, designated for production, is being targeted for deployment and all configurations.
    *   [ ] Authentication methods intended for production (e.g., Email/Password, GitHub OAuth) are enabled and correctly configured (including OAuth client IDs/secrets for production URLs).
    *   [ ] Firestore database is created, located in the correct region, and is accessible by the application with production rules.
    *   [ ] Firebase Storage is enabled, has a production-ready bucket, and is accessible with production rules.
*   [ ] **Firebase Security Rules (`firestore.rules`, `storage.rules`):**
    *   [ ] Security rules have been reviewed against the suggestions and findings from the "Security Review and Hardening" step (Subtask 5).
    *   [ ] Necessary changes for stricter, production-ready rules (e.g., data validation, refined access controls for templates and profile images) have been implemented.
    *   [ ] Security rules have been tested thoroughly, ideally using the Firebase Emulator Suite with test scripts or manual checks covering common and edge cases.
    *   [ ] The final, hardened security rules have been deployed to the **production** Firebase project.
*   [ ] **API Keys (External Services - Production Keys):**
    *   [ ] Production API keys for Firecrawl are correctly configured in the production environment secrets and are functional.
    *   [ ] Production API keys for Stripe (both publishable key for the frontend and secret key for any backend operations) are correctly configured.
    *   [ ] The Stripe account is live, and webhook endpoints (if any) are configured for production URLs and tested.

### III. Application & Features

*   [ ] **`SMOKE_TEST.md`**:
    *   [ ] All smoke test cases outlined in `SMOKE_TEST.md` have been executed on a staging or production-like environment using a production build of the application.
    *   [ ] All critical issues or blockers identified during smoke testing have been addressed, fixed, and successfully re-tested.
*   [ ] **Legal Documents:**
    *   [ ] The placeholder content in `PRIVACY_POLICY.md` has been replaced with an **actual, legally sound Privacy Policy** suitable for DataPulse.ai and its users.
    *   [ ] The placeholder content in `TERMS_OF_SERVICE.md` has been replaced with **actual, legally sound Terms of Service**.
    *   [ ] Links in the application footer (and any other relevant places) correctly point to these updated and final legal documents.
    *   [ ] (If applicable) Mechanisms for obtaining user consent (e.g., cookie consent banner, agreement to terms during signup) are implemented and functional.
*   [ ] **Error Handling & Logging:**
    *   [ ] Graceful error handling is implemented for common user flows (e.g., form submissions, API request failures). Users are shown meaningful error messages.
    *   [ ] (Optional but Recommended) Basic logging mechanisms (e.g., Firebase Functions logging, console logs in Cloud Functions, or a third-party service like Sentry/LogRocket) are in place or have been considered for monitoring potential issues in production.

### IV. Final Checks

*   [ ] **Domain Name & DNS**:
    *   [ ] The custom domain name for DataPulse.ai is registered.
    *   [ ] DNS records are correctly configured to point to Firebase Hosting for the production application. DNS propagation has been verified.
*   [ ] **SSL Certificate**:
    *   [ ] An SSL certificate is active and correctly configured for the custom domain (Firebase Hosting typically handles automatic provisioning and renewal). Verified by accessing the site via HTTPS.
*   [ ] **Backup Plan (Data)**:
    *   [ ] A plan or consideration for backing up Firestore data is in place (e.g., Firebase's built-in scheduled backups, manual exports, or third-party backup solutions).
*   [ ] **Team Communication**:
    *   [ ] All relevant team members (development, support, marketing if applicable) are aware of the launch plan, timing, and their roles/responsibilities post-launch.
*   [ ] **Analytics (If applicable):**
    *   [ ] If web analytics tools (e.g., Google Analytics 4, Plausible) are being used, they are configured with the correct production property/ID and are verified to be tracking visits.

---

## Sign-off

*   [ ] All critical items on this checklist have been thoroughly verified and addressed.
*   Reviewed by: _______________________________
*   Date: _______________________________

---
**Launch Approved: (Yes / No)**I have successfully created the `PRE_LAUNCH_CHECKLIST.md` file in the root of the repository.

The file includes:
-   An **Introduction** explaining the purpose of the checklist and emphasizing its importance.
-   **Checklist Items** categorized into:
    -   I. Environment & Configuration (GitHub Actions secrets, CI/CD pipeline, `ENVIRONMENT_CONFIG.md` review)
    -   II. Backend & Security (Firebase project setup, security rules, external API keys)
    -   III. Application & Features (`SMOKE_TEST.md` execution, final legal documents, error handling/logging)
    -   IV. Final Checks (Domain/DNS, SSL, backup plan, team communication, analytics)
-   A **Sign-off** section for final verification, reviewer name, and date.

Each item is presented as a markdown checkbox `[ ]` for easy tracking. The content is structured to be a comprehensive final manual review before a public launch.
