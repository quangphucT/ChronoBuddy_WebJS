// Firebase Connection Checker for Realtime Database
import { database } from '../config/firebase';
import { ref, get } from 'firebase/database';

export const checkFirebaseConnection = async () => {
  try {
    console.log('🔥 Testing Firebase Realtime Database connection...');
    
    // Test connection by reading root reference
    const testRef = ref(database, '.info/connected');
    
    console.log('📡 Attempting to access Firebase Realtime Database...');
    const snapshot = await get(testRef);
    
    console.log('✅ Firebase Realtime Database connection successful!');
    console.log('Connection status:', snapshot.val());
    
    return {
      success: true,
      message: 'Firebase Realtime Database connection successful',
      connected: snapshot.val()
    };
    
  } catch (error) {
    console.error('❌ Firebase Realtime Database connection failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
};

export const getFirebaseErrorDetails = (error) => {
  const errorMappings = {
    'permission-denied': 'Firestore security rules are blocking this operation. Check your Firebase Console -> Firestore -> Rules',
    'unavailable': 'Firebase service is temporarily unavailable. Check your internet connection.',
    'unauthenticated': 'Authentication required but not provided.',
    'invalid-argument': 'Invalid data provided to Firebase operation.',
    'not-found': 'Requested document or collection does not exist.',
    'already-exists': 'Document already exists.',
    'resource-exhausted': 'Firebase quota exceeded.',
    'failed-precondition': 'Operation failed due to precondition.',
    'aborted': 'Operation was aborted.',
    'out-of-range': 'Operation was attempted past the valid range.',
    'unimplemented': 'Operation is not implemented.',
    'internal': 'Internal Firebase error.',
    'deadline-exceeded': 'Operation deadline exceeded.',
    'cancelled': 'Operation was cancelled.'
  };

  return {
    code: error.code,
    message: error.message,
    suggestion: errorMappings[error.code] || 'Unknown Firebase error. Check the Firebase Console for more details.'
  };
};
