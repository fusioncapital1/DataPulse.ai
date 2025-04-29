/**
 * Firebase Setup Script for DataPulse.ai
 * 
 * This script sets up the initial Firestore collections and documents for the DataPulse.ai application.
 * 
 * IMPORTANT: This script requires a service account key file to run.
 * DO NOT commit your service account key to GitHub!
 * 
 * Usage:
 * 1. Download your service account key from Firebase Console
 * 2. Place it in the same directory as this script (but don't commit it!)
 * 3. Run: npm install firebase-admin
 * 4. Run: node scripts/setup-firebase.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Try to find service account file in current directory
console.log('Looking for service account key file...');
const scriptDir = __dirname;
const files = fs.readdirSync(scriptDir);
const serviceAccountFile = files.find(file => 
  file.includes('firebase-adminsdk') && file.endsWith('.json')
);

if (!serviceAccountFile) {
  console.error('❌ No service account key found!');
  console.error('Please download it from Firebase Console:');
  console.error('1. Go to Project Settings > Service Accounts');
  console.error('2. Click "Generate new private key"');
  console.error('3. Save the JSON file in the scripts directory');
  process.exit(1);
}

console.log(`✅ Found service account key: ${serviceAccountFile}`);
const serviceAccount = require(path.join(scriptDir, serviceAccountFile));

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function setupFirestore() {
  try {
    console.log('Setting up Firestore collections...');
    
    // Create users collection with test user
    await db.collection('users').doc('testuser123').set({
      displayName: 'Test User',
      email: 'test@example.com',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      plan: 'free',
      credits: 5,
      uid: 'testuser123',
      photoURL: '',
      lastLoginAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Created test user');
    
    // Create templates collection with sample
    await db.collection('templates').doc('sampletemplate123').set({
      name: 'Sample E-commerce Template',
      description: 'Extract product data from e-commerce websites',
      mode: 'manual',
      selectors: [
        { name: 'title', selector: 'h1.product-title', attribute: 'text' },
        { name: 'price', selector: 'span.price', attribute: 'text' },
        { name: 'image', selector: 'img.product-image', attribute: 'src' }
      ],
      isPublic: true,
      userId: 'testuser123',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Created sample template');
    
    // Create extractions collection with sample
    await db.collection('extractions').doc('sampleextraction123').set({
      name: 'Sample Extraction',
      url: 'https://example.com/products',
      mode: 'manual',
      selectors: [
        { name: 'title', selector: 'h1.product-title', attribute: 'text' },
        { name: 'price', selector: 'span.price', attribute: 'text' }
      ],
      data: {
        title: 'Example Product',
        price: '$99.99'
      },
      userId: 'testuser123',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Created sample extraction');
    
    // Create subscriptions collection
    await db.collection('subscriptions').doc('placeholder').set({
      info: 'This is a placeholder document',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log('✅ Created subscriptions collection');
    
    console.log('\n🎉 Firebase setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Install Firebase CLI: npm install -g firebase-tools');
    console.log('2. Login to Firebase: firebase login');
    console.log('3. Deploy Firestore rules: firebase deploy --only firestore:rules');
    console.log('4. Deploy Storage rules: firebase deploy --only storage:rules');
    
  } catch (error) {
    console.error('❌ Error during setup:', error);
  }
}

// Run the setup function
setupFirestore();
