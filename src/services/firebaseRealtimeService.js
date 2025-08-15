// src/services/firebaseRealtimeService.js
import { 
  ref, 
  push, 
  set, 
  get, 
  query, 
  orderByChild, 
  equalTo,
  limitToLast,
  orderByKey
} from 'firebase/database';
import { database } from '../config/firebase';

// Add page view log to Firebase Realtime Database
export const addPageLog = async (pageLog) => {
  try {
    console.log('🔥 Attempting to add page log to Firebase Realtime DB:', pageLog);
    
    // Create reference to pageLogs
    const pageLogsRef = ref(database, 'pageLogs');
    
    // Push new page log with auto-generated key
    const newPageLogRef = push(pageLogsRef);
    
    // Set the data
    await set(newPageLogRef, {
      ...pageLog,
      timestamp: Date.now(),
      id: newPageLogRef.key
    });
    
    console.log('✅ Page log successfully added to Firebase:', newPageLogRef.key);
    return newPageLogRef.key;
  } catch (error) {
    console.error('❌ Error adding page log to Firebase:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

// Add unique visitor to Firebase Realtime Database
export const addVisitor = async (visitor) => {
  try {
    console.log('🔥 Attempting to add visitor to Firebase Realtime DB:', visitor);
    
    // Create reference to visitors
    const visitorsRef = ref(database, 'visitors');
    
    // Push new visitor with auto-generated key
    const newVisitorRef = push(visitorsRef);
    
    // Set the visitor data
    await set(newVisitorRef, {
      ...visitor,
      firstVisitTimestamp: Date.now(),
      id: newVisitorRef.key
    });
    
    console.log('✅ Visitor successfully added to Firebase:', newVisitorRef.key);
    return newVisitorRef.key;
  } catch (error) {
    console.error('❌ Error adding visitor to Firebase:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

// Check if visitor exists by fingerprint
export const checkVisitorExists = async (fingerprint) => {
  try {
    console.log('🔍 Checking if visitor exists:', fingerprint);
    
    // Query visitors by fingerprint
    const visitorsRef = ref(database, 'visitors');
    const fingerprintQuery = query(visitorsRef, orderByChild('fingerprint'), equalTo(fingerprint));
    
    const snapshot = await get(fingerprintQuery);
    const exists = snapshot.exists();
    
    console.log('👤 Visitor exists check result:', exists);
    return exists;
  } catch (error) {
    console.error('❌ Error checking visitor exists:', error);
    return false;
  }
};

// Get all page logs from Firebase Realtime Database
export const getAllPageLogs = async (limitCount = 1000) => {
  try {
    console.log('📊 Fetching page logs from Firebase...');
    
    const pageLogsRef = ref(database, 'pageLogs');
    const pageLogsQuery = query(pageLogsRef, orderByKey(), limitToLast(limitCount));
    
    const snapshot = await get(pageLogsQuery);
    
    if (!snapshot.exists()) {
      console.log('📭 No page logs found');
      return [];
    }
    
    const logs = [];
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      logs.push({
        id: childSnapshot.key,
        ...data,
        time: data.time || new Date(data.timestamp).toISOString(),
        timeLocal: data.timeLocal || new Date(data.timestamp).toLocaleString()
      });
    });
    
    // Sort by timestamp descending (newest first)
    logs.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    console.log('✅ Page logs fetched:', logs.length);
    return logs;
  } catch (error) {
    console.error('❌ Error getting page logs:', error);
    return [];
  }
};

// Get all visitors from Firebase Realtime Database
export const getAllVisitors = async () => {
  try {
    console.log('👥 Fetching visitors from Firebase...');
    
    const visitorsRef = ref(database, 'visitors');
    const snapshot = await get(visitorsRef);
    
    if (!snapshot.exists()) {
      console.log('👤 No visitors found');
      return [];
    }
    
    const visitors = [];
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      visitors.push({
        id: childSnapshot.key,
        ...data,
        firstVisit: data.firstVisit || new Date(data.firstVisitTimestamp).toISOString()
      });
    });
    
    // Sort by timestamp descending (newest first)
    visitors.sort((a, b) => (b.firstVisitTimestamp || 0) - (a.firstVisitTimestamp || 0));
    
    console.log('✅ Visitors fetched:', visitors.length);
    return visitors;
  } catch (error) {
    console.error('❌ Error getting visitors:', error);
    return [];
  }
};

// Firebase Analytics Functions for Realtime Database
export const getFirebaseVisitorAnalytics = async () => {
  try {
    console.log('📈 Generating Firebase Realtime DB analytics...');
    
    // Get all logs and visitors
    const [logs, visitors] = await Promise.all([
      getAllPageLogs(),
      getAllVisitors()
    ]);

    // Get today's date
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay()).getTime();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getTime();

    // Filter logs for different time periods
    const todayLogs = logs.filter(log => (log.timestamp || Date.parse(log.time)) >= startOfDay);
    const weekLogs = logs.filter(log => (log.timestamp || Date.parse(log.time)) >= startOfWeek);
    const monthLogs = logs.filter(log => (log.timestamp || Date.parse(log.time)) >= startOfMonth);

    // Filter visitors for different time periods
    const todayVisitors = visitors.filter(visitor => (visitor.firstVisitTimestamp || Date.parse(visitor.firstVisit)) >= startOfDay);
    const weekVisitors = visitors.filter(visitor => (visitor.firstVisitTimestamp || Date.parse(visitor.firstVisit)) >= startOfWeek);
    const monthVisitors = visitors.filter(visitor => (visitor.firstVisitTimestamp || Date.parse(visitor.firstVisit)) >= startOfMonth);

    // Get page views breakdown
    const getPageViewsBreakdown = (logs) => {
      const breakdown = {};
      logs.forEach(log => {
        breakdown[log.path] = (breakdown[log.path] || 0) + 1;
      });
      return Object.entries(breakdown)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count);
    };

    // Get browser/device statistics
    const getBrowserStats = (logs) => {
      const browsers = {};
      const devices = {};

      logs.forEach(log => {
        const userAgent = (log.userAgent || '').toLowerCase();

        // Simple browser detection
        let browser = 'Other';
        if (userAgent.includes('chrome')) browser = 'Chrome';
        else if (userAgent.includes('firefox')) browser = 'Firefox';
        else if (userAgent.includes('safari')) browser = 'Safari';
        else if (userAgent.includes('edge')) browser = 'Edge';

        // Simple device detection
        let device = 'Desktop';
        if (userAgent.includes('mobile')) device = 'Mobile';
        else if (userAgent.includes('tablet')) device = 'Tablet';

        browsers[browser] = (browsers[browser] || 0) + 1;
        devices[device] = (devices[device] || 0) + 1;
      });

      return {
        browsers: Object.entries(browsers).map(([name, count]) => ({ name, count })),
        devices: Object.entries(devices).map(([name, count]) => ({ name, count }))
      };
    };

    const analytics = {
      // Total metrics
      totalPageViews: logs.length,
      totalUniqueVisitors: visitors.length,

      // Today metrics
      todayPageViews: todayLogs.length,
      todayUniqueVisitors: todayVisitors.length,

      // This week metrics
      weekPageViews: weekLogs.length,
      weekUniqueVisitors: weekVisitors.length,

      // This month metrics
      monthPageViews: monthLogs.length,
      monthUniqueVisitors: monthVisitors.length,

      // Detailed breakdowns
      pageViewsBreakdown: getPageViewsBreakdown(logs),
      browserStats: getBrowserStats(logs),

      // Recent activity
      recentLogs: logs.slice(0, 50) // First 50 logs (already ordered by timestamp desc)
    };

    console.log('✅ Firebase analytics generated:', analytics);
    return analytics;

  } catch (error) {
    console.error('❌ Error getting Firebase visitor analytics:', error);
    return {
      totalPageViews: 0,
      totalUniqueVisitors: 0,
      todayPageViews: 0,
      todayUniqueVisitors: 0,
      weekPageViews: 0,
      weekUniqueVisitors: 0,
      monthPageViews: 0,
      monthUniqueVisitors: 0,
      pageViewsBreakdown: [],
      browserStats: { browsers: [], devices: [] },
      recentLogs: []
    };
  }
};

// Export visitor data from Firebase Realtime Database
export const exportFirebaseVisitorData = async () => {
  try {
    console.log('📤 Exporting Firebase visitor data...');
    const analytics = await getFirebaseVisitorAnalytics();
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `firebase-realtime-visitor-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    console.log('✅ Firebase visitor data exported successfully');
  } catch (error) {
    console.error('❌ Error exporting Firebase visitor data:', error);
    throw error;
  }
};
