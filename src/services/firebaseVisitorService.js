// src/services/firebaseVisitorService.js
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collections
const PAGE_LOGS_COLLECTION = 'pageLogs';
const VISITORS_COLLECTION = 'visitors';
const ANALYTICS_SUMMARY_COLLECTION = 'analyticsSummary';

// Add page view log to Firebase
export const addPageLog = async (pageLog) => {
  try {
    console.log('🔥 Attempting to add page log to Firebase:', pageLog);
    const docRef = await addDoc(collection(db, PAGE_LOGS_COLLECTION), {
      ...pageLog,
      timestamp: Timestamp.fromDate(new Date(pageLog.time))
    });
    console.log('✅ Page log successfully added to Firebase:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding page log to Firebase:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

// Add unique visitor to Firebase
export const addVisitor = async (visitor) => {
  try {
    console.log('🔥 Attempting to add visitor to Firebase:', visitor);
    const docRef = await addDoc(collection(db, VISITORS_COLLECTION), {
      ...visitor,
      firstVisitTimestamp: Timestamp.fromDate(new Date(visitor.firstVisit))
    });
    console.log('✅ Visitor successfully added to Firebase:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding visitor to Firebase:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

// Check if visitor exists
export const checkVisitorExists = async (fingerprint) => {
  try {
    const q = query(
      collection(db, VISITORS_COLLECTION),
      where('fingerprint', '==', fingerprint),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking visitor:', error);
    return false;
  }
};

// Get page logs for a date range
export const getPageLogs = async (startDate, endDate, limitCount = 1000) => {
  try {
    const q = query(
      collection(db, PAGE_LOGS_COLLECTION),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      where('timestamp', '<=', Timestamp.fromDate(endDate)),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const logs = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      logs.push({
        id: doc.id,
        ...data,
        time: data.timestamp.toDate().toISOString(),
        timeLocal: data.timestamp.toDate().toLocaleString()
      });
    });
    
    return logs;
  } catch (error) {
    console.error('Error getting page logs:', error);
    return [];
  }
};

// Get all page logs (for analytics)
export const getAllPageLogs = async (limitCount = 5000) => {
  try {
    const q = query(
      collection(db, PAGE_LOGS_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const logs = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      logs.push({
        id: doc.id,
        ...data,
        time: data.timestamp.toDate().toISOString(),
        timeLocal: data.timestamp.toDate().toLocaleString()
      });
    });
    
    return logs;
  } catch (error) {
    console.error('Error getting all page logs:', error);
    return [];
  }
};

// Get visitors for a date range
export const getVisitors = async (startDate, endDate) => {
  try {
    const q = query(
      collection(db, VISITORS_COLLECTION),
      where('firstVisitTimestamp', '>=', Timestamp.fromDate(startDate)),
      where('firstVisitTimestamp', '<=', Timestamp.fromDate(endDate)),
      orderBy('firstVisitTimestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const visitors = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      visitors.push({
        id: doc.id,
        ...data,
        firstVisit: data.firstVisitTimestamp.toDate().toISOString()
      });
    });
    
    return visitors;
  } catch (error) {
    console.error('Error getting visitors:', error);
    return [];
  }
};

// Get all visitors
export const getAllVisitors = async () => {
  try {
    const q = query(
      collection(db, VISITORS_COLLECTION),
      orderBy('firstVisitTimestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const visitors = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      visitors.push({
        id: doc.id,
        ...data,
        firstVisit: data.firstVisitTimestamp.toDate().toISOString()
      });
    });
    
    return visitors;
  } catch (error) {
    console.error('Error getting all visitors:', error);
    return [];
  }
};

// Firebase Analytics Functions
export const getFirebaseVisitorAnalytics = async () => {
  try {
    // Get all logs and visitors
    const [logs, visitors] = await Promise.all([
      getAllPageLogs(),
      getAllVisitors()
    ]);

    // Get today's date
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Filter logs for different time periods
    const todayLogs = logs.filter(log => new Date(log.time) >= startOfDay);
    const weekLogs = logs.filter(log => new Date(log.time) >= startOfWeek);
    const monthLogs = logs.filter(log => new Date(log.time) >= startOfMonth);

    // Filter visitors for different time periods
    const todayVisitors = visitors.filter(visitor => new Date(visitor.firstVisit) >= startOfDay);
    const weekVisitors = visitors.filter(visitor => new Date(visitor.firstVisit) >= startOfWeek);
    const monthVisitors = visitors.filter(visitor => new Date(visitor.firstVisit) >= startOfMonth);

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
        const userAgent = log.userAgent.toLowerCase();

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

    return {
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

  } catch (error) {
    console.error('Error getting Firebase visitor analytics:', error);
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

// Export visitor data from Firebase
export const exportFirebaseVisitorData = async () => {
  try {
    const analytics = await getFirebaseVisitorAnalytics();
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `firebase-visitor-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  } catch (error) {
    console.error('Error exporting Firebase visitor data:', error);
    throw error;
  }
};
