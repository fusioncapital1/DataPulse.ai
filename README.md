# DataPulse.ai

DataPulse.ai is an AI-powered data extraction and analytics platform that transforms unstructured web data into actionable insights. Built as a Progressive Web App (PWA), it's designed for easy deployment to app stores and provides a seamless experience across devices.

![DataPulse.ai Logo](public/icons/icon-192x192.png)

## Features

- **Visual Data Extractor**: Point-and-click interface to select data from websites
- **Pulse Monitoring**: Track changes to data sources over time
- **AI Insights Engine**: Automatic pattern detection and anomaly alerts
- **Template Marketplace**: Share and monetize extraction templates
- **Integration Hub**: Connect with popular tools (Sheets, Airtable, Notion)
- **PWA Support**: Works offline and can be installed on mobile devices
- **Responsive Design**: Optimized for desktop, tablet, and mobile

## Technology Stack

- **Frontend**: React-based PWA with modular components
- **Backend**: Serverless architecture using Firebase/Firestore
- **Data Processing**: Firecrawl dev for extraction, OpenAI for insights
- **Authentication**: GitHub OAuth + email/password
- **Deployment**: GitHub Actions for CI/CD
- **PWA Features**: Service workers, manifest, offline support

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Firebase account
- Firecrawl API key
- Firebase CLI (firebase-tools): For managing Firebase deployments. Install via `npm install -g firebase-tools` or use with `npx`.

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/fusioncapital1/datapulse-ai.git
   cd datapulse-ai
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your Firebase and Firecrawl credentials

5. Start the development server
   ```bash
   npm start
   ```

### Firebase Setup

1. Create a new Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password and GitHub)
3. Create a Firestore database
4. Set up Firebase Storage
5. Download your service account key:
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file in the `scripts` directory. The `setup-firebase.js` script will look for a JSON file in this directory that includes `firebase-adminsdk` in its name (e.g., `yourproject-firebase-adminsdk-xxxx.json`). **Important**: Do not commit this sensitive file to Git; ensure it's listed in your `.gitignore`.
6. Run the Firebase setup script:
   - Make sure all dependencies are installed by running `npm install` from the project root (this should include `firebase-admin`, which is used by the setup script).
   - Then, run the script:
     ```bash
     node scripts/setup-firebase.js
     ```
   This script will create all necessary collections and sample data.
7. Deploy Firestore security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Deployment

The project includes GitHub Actions workflows for CI/CD. Note: The current CI/CD pipeline automatically deploys the web application (Hosting). Changes to Firestore rules, Storage rules, or Firestore indexes need to be deployed manually (e.g., `firebase deploy --only firestore:rules,storage:rules` or `firebase deploy`). To deploy manually:

1. Build the project
   ```bash
   npm run build
   ```

2. Deploy to Firebase
   ```bash
   firebase deploy
   ```
The CI workflow (`.github/workflows/ci.yml`) currently includes `npm run lint || true` and `npm test || true`. This means linting errors or failing tests will not stop the build or deployment. For stricter quality gates, consider removing the `|| true` parts to ensure builds fail on such issues.

## App Store Submission

DataPulse.ai is designed to be easily submitted to app stores:

### Google Play Store

1. Use [PWA Builder](https://www.pwabuilder.com/) to generate an Android App Bundle
2. Follow the [Google Play submission guidelines](https://developer.android.com/distribute/console)

### Apple App Store

1. Use [PWA Builder](https://www.pwabuilder.com/) to generate an Xcode project
2. Follow the [App Store submission guidelines](https://developer.apple.com/app-store/submissions/)

## Project Structure

```
datapulse-ai/
├── public/                  # Static files
│   ├── icons/               # App icons
│   ├── manifest.json        # PWA manifest
│   └── service-worker.js    # Service worker
├── src/
│   ├── components/          # Reusable components
│   ├── pages/               # Page components
│   ├── services/            # API services
│   └── utils/               # Utility functions
├── scripts/                 # Utility scripts
│   └── setup-firebase.js    # Firebase setup script
├── .github/                 # GitHub Actions workflows
├── firebase.json            # Firebase configuration
├── firestore.rules          # Firestore security rules
└── storage.rules            # Storage security rules
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

© 2025 FusionCapital. All rights reserved.

## Contact

FusionCapital - [GitHub](https://github.com/fusioncapital1)

Project Link: [https://github.com/fusioncapital1/datapulse-ai](https://github.com/fusioncapital1/datapulse-ai)
