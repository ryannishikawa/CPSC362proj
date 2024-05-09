/**
 *  @file firebaseConfig.js
 *  @author Matt De Binion <mattdb@csu.fullerton.edu>
 *  @description This file contains Firebase product SDKS and the web application configuration.
 * 
 *  See {@link https://firebase.google.com/docs/web/setup#available-libraries} for more documentation on these SDKs.
 * 
 */
import { initializeApp } from 'firebase/app';                                                         // The Firebase application
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check';                 // Using ReCaptchaEnterprise as attestation provider for backend.
import { getPerformance } from 'firebase/performance';                                                // Application performance metrics

// Use the debug attestation provider key to bypass AppCheck if process.env.NODE_ENV is in development.
// Otherwise, use the ReCaptcha Enterprise key.
let attestationProviderKey;

if(process.env.NODE_ENV === 'production') {
  attestationProviderKey = process.env.REACT_APP_ATTESTATION_PROVIDER_KEY;
} else {
  window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  attestationProviderKey = process.env.REACT_APP_ATTESTATION_DEBUG_KEY;
}

/**
 * The Firebase configuration.
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

/**
 * The FirebaseApp instance.
 * @type {import('firebase/app').FirebaseApp}
 */
const app = initializeApp(firebaseConfig);

/**
 * The ReCaptchaEnterpriseProvider instance for AppCheck
 * See {@link https://cloud.google.com/security/products/recaptcha-enterprise/pricing} for ReCaptcha Enterprise pricing (1 mil. free calls per month)
 */
// eslint-disable-next-line no-unused-vars
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(attestationProviderKey),
  isTokenAutoRefreshEnabled: true
});

/**
 * The performance isntance for the FirebaseApp instance.
 * @type {import('firebase/performance').FirebasePerformance}
 */
const perf = getPerformance(app);

// All exports needed for the application.
export { app, perf, appCheck };