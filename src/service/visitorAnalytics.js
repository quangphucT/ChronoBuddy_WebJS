// src/service/visitorAnalytics.js
import { getFirebaseVisitorAnalytics } from '../services/firebaseRealtimeService';

// Get visitor analytics from Firebase
export const getVisitorAnalytics = async () => {
  try {
    const analytics = await getFirebaseVisitorAnalytics();
    return analytics;
  } catch (error) {
    console.error('⚠️ Error getting Firebase analytics, falling back to localStorage:', error);
    
    // Fallback to localStorage if Firebase fails
    return getLocalStorageAnalytics();
  }
};

// Fallback function for localStorage analytics
const getLocalStorageAnalytics = () => {
  try {
    const logs = JSON.parse(localStorage.getItem('pageLogs') || '[]');
    const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');

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
      recentLogs: logs.slice(-50).reverse() // Last 50 logs, newest first
    };

  } catch (error) {
    console.error('⚠️ Error getting localStorage analytics:', error);
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

// Get real-time visitor count (Firebase)
export const getRealTimeVisitorCount = async () => {
  try {
    const analytics = await getFirebaseVisitorAnalytics();
    return analytics.todayUniqueVisitors || 0;
  } catch (error) {
    console.error('⚠️ Error getting real-time visitor count:', error);
    return 0;
  }
};

// Export analytics data
export const exportAnalyticsData = async () => {
  try {
    const analytics = await getVisitorAnalytics();
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `chronobuddy-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    return true;
  } catch (error) {
    console.error('⚠️ Error exporting analytics data:', error);
    return false;
  }
};
