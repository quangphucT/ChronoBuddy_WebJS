// src/hooks/usePageTracker.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  addPageLog, 
  addVisitor, 
  checkVisitorExists 
} from '../services/firebaseRealtimeService';

// Generate a simple browser fingerprint
const generateFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px Arial';
  ctx.fillText('Browser fingerprint', 2, 2);
  
  const fingerprint = btoa(
    navigator.userAgent + 
    navigator.language + 
    screen.width + 
    screen.height + 
    new Date().getTimezoneOffset() + 
    canvas.toDataURL()
  ).slice(0, 16);
  
  return fingerprint;
};

// Generate session ID
const generateSessionId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Get or create session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('chronobuddy_session');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('chronobuddy_session', sessionId);
  }
  return sessionId;
};

const usePageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPage = async () => {
      try {
        const fingerprint = generateFingerprint();
        const sessionId = getSessionId();
        const timestamp = new Date();

        // Check if this is a new visitor
        const isExistingVisitor = await checkVisitorExists(fingerprint);
        
        if (!isExistingVisitor) {
          // Add new visitor
          const visitorData = {
            fingerprint,
            firstVisit: timestamp.toISOString(),
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            referrer: document.referrer || 'Direct'
          };

          await addVisitor(visitorData);
          console.log('🔥 New visitor added to Firebase:', fingerprint);
        }

        // Always add page log
        const pageLogData = {
          fingerprint,
          sessionId,
          path: location.pathname,
          fullUrl: window.location.href,
          title: document.title,
          time: timestamp.toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'Direct',
          isNewVisitor: !isExistingVisitor
        };

        await addPageLog(pageLogData);
        console.log('🔥 Page view logged to Firebase:', location.pathname);

      } catch (error) {
        console.error('⚠️ Error tracking page in Firebase:', error);
        
        // Fallback to localStorage if Firebase fails
        try {
          const fingerprint = generateFingerprint();
          const sessionId = getSessionId();
          const timestamp = new Date();

          // Fallback page log
          const pageLogData = {
            fingerprint,
            sessionId,
            path: location.pathname,
            fullUrl: window.location.href,
            title: document.title,
            time: timestamp.toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer || 'Direct'
          };

          // Store in localStorage as backup
          const existingLogs = JSON.parse(localStorage.getItem('chronobuddy_page_logs') || '[]');
          existingLogs.push(pageLogData);
          localStorage.setItem('chronobuddy_page_logs', JSON.stringify(existingLogs));

          console.log('📱 Page view logged to localStorage as fallback');
        } catch (localError) {
          console.error('⚠️ Failed to save to localStorage fallback:', localError);
        }
      }
    };

    // Track the page with a small delay to ensure the page is fully loaded
    const timeoutId = setTimeout(trackPage, 100);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);
};

export default usePageTracker;
