// src/utils/visitorAnalytics.js
export const getVisitorAnalytics = () => {
  const logs = JSON.parse(localStorage.getItem("pageLogs") || "[]");
  const visitors = JSON.parse(localStorage.getItem("visitors") || "[]");
  
  // Get today's date
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  // Analyze page logs
  const todayLogs = logs.filter(log => new Date(log.time) >= startOfDay);
  const weekLogs = logs.filter(log => new Date(log.time) >= startOfWeek);
  const monthLogs = logs.filter(log => new Date(log.time) >= startOfMonth);
  
  // Analyze visitors
  const todayVisitors = visitors.filter(visitor => new Date(visitor.firstVisit) >= startOfDay);
  const weekVisitors = visitors.filter(visitor => new Date(visitor.firstVisit) >= startOfWeek);
  const monthVisitors = visitors.filter(visitor => new Date(visitor.firstVisit) >= startOfMonth);
  
  // Get unique visitors by session/fingerprint
  const getUniqueVisitors = (logs) => {
    const uniqueUsers = new Set();
    logs.forEach(log => {
      // Create a simple fingerprint based on userAgent and some other factors
      const fingerprint = btoa(log.userAgent + log.sessionId || '').slice(0, 10);
      uniqueUsers.add(fingerprint);
    });
    return uniqueUsers.size;
  };
  
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
  
  // Get hourly distribution for today
  const getHourlyDistribution = (logs) => {
    const hours = Array(24).fill(0);
    logs.forEach(log => {
      const hour = new Date(log.time).getHours();
      hours[hour]++;
    });
    return hours.map((count, hour) => ({ hour, count }));
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
    todayUniqueVisitors: getUniqueVisitors(todayLogs),
    
    // This week metrics
    weekPageViews: weekLogs.length,
    weekUniqueVisitors: getUniqueVisitors(weekLogs),
    
    // This month metrics
    monthPageViews: monthLogs.length,
    monthUniqueVisitors: getUniqueVisitors(monthLogs),
    
    // Detailed breakdowns
    pageViewsBreakdown: getPageViewsBreakdown(logs),
    todayHourlyDistribution: getHourlyDistribution(todayLogs),
    browserStats: getBrowserStats(logs),
    
    // Recent activity
    recentLogs: logs.slice(-50).reverse() // Last 50 logs, newest first
  };
};

export const exportVisitorData = () => {
  const analytics = getVisitorAnalytics();
  const dataStr = JSON.stringify(analytics, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `visitor-analytics-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};

export const clearVisitorData = () => {
  localStorage.removeItem("pageLogs");
  localStorage.removeItem("visitors");
  return true;
};

export const getVisitorGrowthData = (days = 30) => {
  const logs = JSON.parse(localStorage.getItem("pageLogs") || "[]");
  const growth = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const dayLogs = logs.filter(log => {
      const logDate = new Date(log.time);
      return logDate >= dayStart && logDate < dayEnd;
    });
    
    growth.push({
      date: date.toISOString().split('T')[0],
      pageViews: dayLogs.length,
      uniqueVisitors: new Set(dayLogs.map(log => btoa(log.userAgent).slice(0, 10))).size
    });
  }
  
  return growth;
};
