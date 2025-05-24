# Production Environment Variable Configuration for DataPulse.ai

## 1. Introduction

This document outlines how to configure environment variables for **production builds** of the DataPulse.ai application. While a `.env` file is typically used for local development (and should be included in `.gitignore`), production builds, especially those performed by CI/CD systems, require a different approach to set these variables.

## 2. Production Build Process and Environment Variables

DataPulse.ai is built using Create React App. During the build process (`npm run build`), Create React App embeds any environment variables that start with `REACT_APP_` directly into the static application bundle.

For CI/CD builds (e.g., using GitHub Actions), these `REACT_APP_` variables must be made available in the environment where the build command is executed.

## 3. Required Production Environment Variables

The following `REACT_APP_` variables must be configured for a production deployment. These should point to your **production** services and configurations.

*   **Firebase Configuration:**
    *   `REACT_APP_FIREBASE_API_KEY`: Your production Firebase project API Key.
    *   `REACT_APP_FIREBASE_AUTH_DOMAIN`: Your production Firebase project Authentication Domain.
    *   `REACT_APP_FIREBASE_PROJECT_ID`: Your *production* Firebase Project ID.
    *   `REACT_APP_FIREBASE_STORAGE_BUCKET`: Your production Firebase project Storage Bucket.
    *   `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`: Your production Firebase project Messaging Sender ID.
    *   `REACT_APP_FIREBASE_APP_ID`: Your production Firebase project App ID.
    *   `REACT_APP_FIREBASE_MEASUREMENT_ID`: Your production Firebase project Measurement ID (optional, but include if used).

*   **API Configuration:**
    *   `REACT_APP_API_BASE_URL`: The base URL for your backend API (if different for production, e.g., `https://api.datapulse.ai/v1`).

*   **Firecrawl Configuration:**
    *   `REACT_APP_FIRECRAWL_API_KEY`: Your *production* Firecrawl API Key.

*   **Stripe Configuration:**
    *   `REACT_APP_STRIPE_PUBLISHABLE_KEY`: Your *production* Stripe publishable key.
    *   `REACT_APP_STRIPE_PRICE_ID_MONTHLY`: Your *production* Stripe Price ID for monthly subscriptions.
    *   `REACT_APP_STRIPE_PRICE_ID_ANNUAL`: Your *production* Stripe Price ID for annual subscriptions.

*   **PWA Configuration (Customize if production values differ from development):**
    *   `REACT_APP_PWA_NAME`: The name of your PWA (e.g., "DataPulse.ai").
    *   `REACT_APP_PWA_SHORT_NAME`: A shorter name for your PWA (e.g., "DataPulse").
    *   `REACT_APP_PWA_THEME_COLOR`: The theme color for the PWA.
    *   `REACT_APP_PWA_BACKGROUND_COLOR`: The background color for the PWA.

## 4. Secure Handling of Production Keys in CI/CD

Sensitive information like API keys and Firebase project details should **never** be hardcoded directly into your CI/CD workflow files. Instead, use the secrets management features provided by your CI/CD system.

For GitHub Actions, this means using **GitHub Secrets**.
1.  Navigate to your repository on GitHub.
2.  Go to `Settings` > `Secrets and variables` > `Actions`.
3.  Click `New repository secret` to add each production environment variable listed above (e.g., `PROD_FIREBASE_API_KEY`, `PROD_FIRECRAWL_API_KEY`).

These secrets are then exposed as environment variables to the build step in your GitHub Actions workflow. For example, the `PROJECT_ID` for Firebase deployment in the `ci.yml` file is already configured to use `secrets.PRODUCTION_FIREBASE_PROJECT_ID`. A similar approach should be used for all `REACT_APP_` build-time variables.

## 5. Example Snippet for GitHub Actions (Conceptual)

Below is a conceptual example of how you might pass these secrets as environment variables to the `npm run build` command within a GitHub Actions workflow. The `env` block in the "Build Application" step makes the secrets available to the build process.

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  # ... other triggers

jobs:
  build-and-deploy: # Combined job for simplicity, or could be separate build/deploy jobs
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 16.x # Or your project's Node.js version
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci # Use ci for cleaner installs in CI

      - name: Build Application
        run: npm run build
        env:
          # Firebase
          REACT_APP_FIREBASE_API_KEY: ${{ secrets.PROD_FIREBASE_API_KEY }}
          REACT_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.PROD_FIREBASE_AUTH_DOMAIN }}
          REACT_APP_FIREBASE_PROJECT_ID: ${{ secrets.PRODUCTION_FIREBASE_PROJECT_ID }} # Using the existing secret for consistency
          REACT_APP_FIREBASE_STORAGE_BUCKET: ${{ secrets.PROD_FIREBASE_STORAGE_BUCKET }}
          REACT_APP_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.PROD_FIREBASE_MESSAGING_SENDER_ID }}
          REACT_APP_FIREBASE_APP_ID: ${{ secrets.PROD_FIREBASE_APP_ID }}
          REACT_APP_FIREBASE_MEASUREMENT_ID: ${{ secrets.PROD_FIREBASE_MEASUREMENT_ID }}
          # API
          REACT_APP_API_BASE_URL: ${{ secrets.PROD_API_BASE_URL }}
          # Firecrawl
          REACT_APP_FIRECRAWL_API_KEY: ${{ secrets.PROD_FIRECRAWL_API_KEY }}
          # Stripe
          REACT_APP_STRIPE_PUBLISHABLE_KEY: ${{ secrets.PROD_STRIPE_PUBLISHABLE_KEY }}
          REACT_APP_STRIPE_PRICE_ID_MONTHLY: ${{ secrets.PROD_STRIPE_PRICE_ID_MONTHLY }}
          REACT_APP_STRIPE_PRICE_ID_ANNUAL: ${{ secrets.PROD_STRIPE_PRICE_ID_ANNUAL }}
          # PWA - Only include if they differ from default and need to be secret
          # REACT_APP_PWA_NAME: ${{ secrets.PROD_PWA_NAME }} 

      # ... rest of your deployment steps, e.g., uploading artifact or deploying to Firebase
      # Example: Deploy to Firebase Hosting
      # - name: Deploy to Firebase
      #   uses: w9jds/firebase-action@master
      #   with:
      #     args: deploy --only hosting
      #   env:
      #     FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
      #     PROJECT_ID: ${{ secrets.PRODUCTION_FIREBASE_PROJECT_ID }} # From repository secrets
```

**Important:** You must create secrets in your GitHub repository (e.g., `PROD_FIREBASE_API_KEY`, `PROD_FIRECRAWL_API_KEY`, `PROD_API_BASE_URL`, etc.) for the `npm run build` step to access them. The `FIREBASE_TOKEN` and `PRODUCTION_FIREBASE_PROJECT_ID` are typically used for the deployment step itself, as shown in the existing `ci.yml`. Ensure all `REACT_APP_*` variables needed by your application at runtime are available during the build.
