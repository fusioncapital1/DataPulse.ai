# DataPulse.ai Scripts

This directory contains utility scripts for the DataPulse.ai application.

## Firebase Setup Script

The `setup-firebase.js` script initializes your Firebase Firestore database with the necessary collections and sample data for the DataPulse.ai application.

### Prerequisites

- Node.js installed
- Firebase project created
- Service account key downloaded from Firebase Console

### Usage

1. **Download your service account key**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file in this `scripts` directory

2. **Install dependencies**:
   ```bash
   npm install firebase-admin
   ```

3. **Run the script**:
   ```bash
   node scripts/setup-firebase.js
   ```

### What the script does

- Creates a `users` collection with a test user
- Creates a `templates` collection with a sample template
- Creates an `extractions` collection with a sample extraction
- Creates a `subscriptions` collection with a placeholder document

### Important Security Note

**NEVER commit your service account key to GitHub!** 

The service account key contains sensitive credentials that should be kept private. Make sure to:

1. Add the service account key file to your `.gitignore` file
2. Keep the key file secure and don't share it publicly
3. Rotate the key if you suspect it has been compromised

## Next Steps After Running the Script

After running the setup script:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Deploy Firestore rules: `firebase deploy --only firestore:rules`
4. Deploy Storage rules: `firebase deploy --only storage:rules`
