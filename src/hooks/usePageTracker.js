// src/hooks/usePageTracker.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const usePageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Generate session ID if not exists
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('sessionId', sessionId);
    }

    // Create page log entry
    const log = {
      path: location.pathname,
      time: new Date().toISOString(),
      timeLocal: new Date().toLocaleString(),
      userAgent: navigator.userAgent,
      sessionId: sessionId,
      timestamp: Date.now(),
      referrer: document.referrer || 'direct',
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language || 'unknown'
    };

    // Get existing logs
    const logs = JSON.parse(localStorage.getItem("pageLogs") || "[]");
    logs.push(log);
    
    // Keep only last 1000 logs to prevent storage overflow
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000);
    }
    
    localStorage.setItem("pageLogs", JSON.stringify(logs));

    // Track unique visitors
    const visitors = JSON.parse(localStorage.getItem("visitors") || "[]");
    const userFingerprint = btoa(navigator.userAgent + navigator.language + screen.width + screen.height).slice(0, 16);
    
    // Check if this visitor already exists
    const existingVisitor = visitors.find(v => v.fingerprint === userFingerprint);
    
    if (!existingVisitor) {
      const newVisitor = {
        fingerprint: userFingerprint,
        firstVisit: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown'
      };
      visitors.push(newVisitor);
      
      // Keep only last 500 unique visitors
      if (visitors.length > 500) {
        visitors.splice(0, visitors.length - 500);
      }
      
      localStorage.setItem("visitors", JSON.stringify(visitors));
    }

  }, [location]);
};

export default usePageTracker;
