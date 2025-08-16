import { useEffect, useState } from 'react';
import './index.scss';
import { toast } from 'react-toastify';
import { getPaymentYear } from '../../../../apis/getPaymentYearApi';
import { getPaymentMonth } from '../../../../apis/getPaymentMonthApi';
import { getRevenueEachPackageYear } from '../../../../apis/getRevenueEachPackageYearApi';
import { getRevenueEachPackageMonth } from '../../../../apis/getRevenueEachPackageMonthApi';
import { getTransactionStats } from '../../../../apis/transaction/transactionApi';
import { getVisitorAnalytics, exportAnalyticsData } from '../../../../service/visitorAnalytics';
import usePageTracker from '../../../../hooks/usePageTracker';
import { 
  Button, 
  Card, 
  Input, 
  Select, 
  Spin, 
  Row, 
  Col, 
  Statistic, 
  Space,
  Typography,
  Divider,
  DatePicker,
  Table,
  Progress,
  Tag
} from 'antd';
import { 
  BarChartOutlined, 
  CalendarOutlined, 
  DollarOutlined,
  SearchOutlined,
  ReloadOutlined,
  LineChartOutlined,
  EyeOutlined,
  UserOutlined,
  GlobalOutlined,
  MobileOutlined,
  DesktopOutlined,
  DownloadOutlined,
  CreditCardOutlined,
  ShoppingCartOutlined,
  BankOutlined,
  CheckCircleOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

const StatisticsManagement = () => {
  // Enable page tracking
  usePageTracker();
  
  const yearList = [2022, 2023, 2024, 2025];

  // Revenue states
  const [totalPaymentYear, setTotalPaymentYear] = useState(null);
  const [totalPaymentMonth, setTotalPaymentMonth] = useState(null);
  const [totalRevenueEachPackageYear, setTotalRevenueEachPackageYear] = useState(null);
  const [totalRevenueEachPackageMonth, setTotalRevenueEachPackageMonth] = useState(null);

  // Loading states
  const [loadingYear, setLoadingYear] = useState(false);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMonthRevenue, setLoadingMonthRevenue] = useState(false);

  // Revenue filter states
  const [year, setYear] = useState(new Date().getFullYear());
  const [yearAndMonth, setYearAndMonth] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(null);

  const [subcriptionPlansId, setSubcriptionPlansId] = useState('');
  const [yearSubcriptionPlans, setYearSubcriptionPlans] = useState(null);

  const [subcriptionPlansIdMonth, setSubcriptionPlansIdMonth] = useState('');
  const [monthSubcriptionPlans, setMonthSubcriptionPlans] = useState(null);
  const [yearSubcriptionPlansMonth, setYearSubcriptionPlansMonth] = useState(null);

  // Visitor analytics states
  const [visitorAnalytics, setVisitorAnalytics] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Transaction analytics states
  const [transactionData, setTransactionData] = useState([]);
  const [transactionStats, setTransactionStats] = useState({
    totalRevenue: 0,
    totalTransactions: 0,
    avgTransactionValue: 0,
    paymentMethods: {},
    subscriptionPlans: {},
    recentTransactions: []
  });
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // Refresh visitor analytics
  const refreshVisitorAnalytics = async () => {
    setRefreshing(true);
    try {
      const analytics = await getVisitorAnalytics();
      setVisitorAnalytics(analytics);
      toast.success('🔥 Visitor analytics refreshed from Firebase!');
    } catch (error) {
      toast.error('⚠️ Failed to refresh analytics');
      console.error('Error refreshing analytics:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Export visitor data
  const handleExportVisitorData = async () => {
    try {
      await exportAnalyticsData();
      toast.success('📊 Visitor data exported successfully!');
    } catch (error) {
      toast.error('⚠️ Failed to export visitor data');
      console.error('Error exporting data:', error);
    }
  };

  // Clear visitor data (Firebase version - note: this would require additional Firebase functions)
  const handleClearVisitorData = () => {
    toast.warning('⚠️ Clear data function not implemented for Firebase version. Please use Firebase Console to manage data.');
  };

  // Fetch transaction analytics
  const fetchTransactionAnalytics = async () => {
    setLoadingTransactions(true);
    try {
      const response = await getTransactionStats();
      const transactions = response?.data || [];
      setTransactionData(transactions);

      // Calculate statistics
      const totalRevenue = transactions.reduce((sum, transaction) => sum + transaction.totalMoney, 0);
      const totalTransactions = transactions.length;
      const avgTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

      // Payment methods breakdown
      const paymentMethods = transactions.reduce((acc, transaction) => {
        acc[transaction.paymentMethod] = (acc[transaction.paymentMethod] || 0) + 1;
        return acc;
      }, {});

      // Subscription plans breakdown
      const subscriptionPlans = transactions.reduce((acc, transaction) => {
        acc[transaction.subscriptionPlanName] = (acc[transaction.subscriptionPlanName] || 0) + transaction.totalMoney;
        return acc;
      }, {});

      // Recent transactions (last 5)
      const recentTransactions = transactions
        .sort((a, b) => new Date(b.paidAt) - new Date(a.paidAt))
        .slice(0, 5);

      setTransactionStats({
        totalRevenue,
        totalTransactions,
        avgTransactionValue,
        paymentMethods,
        subscriptionPlans,
        recentTransactions
      });

      toast.success('💳 Transaction analytics loaded successfully!');
    } catch (error) {
      toast.error('⚠️ Failed to load transaction analytics');
      console.error('Error fetching transaction analytics:', error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Năm - Tổng thanh toán
  const fetchPaymentYear = async () => {
    if (!year) return;
    setLoadingYear(true);
    try {
      const res = await getPaymentYear(year);
      setTotalPaymentYear(res.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message?.error || "Failed to fetch yearly data.");
    } finally {
      setLoadingYear(false);
    }
  };

  // Tháng - Tổng thanh toán
  const fetchPaymentMonth = async () => {
    if (!yearAndMonth || !month) return;
    setLoadingMonth(true);
    try {
      const res = await getPaymentMonth(yearAndMonth, month);
      setTotalPaymentMonth(res.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message?.error || "Failed to fetch monthly data.");
    } finally {
      setLoadingMonth(false);
    }
  };

  // Năm - Doanh thu theo subscription plan
  const fetchRevenueEachPackageYear = async () => {
    if (!subcriptionPlansId || !yearSubcriptionPlans) {
      toast.warning("Please enter Subscription Plan ID and select Year.");
      return;
    }
    setLoading(true);
    try {
      const res = await getRevenueEachPackageYear(subcriptionPlansId, yearSubcriptionPlans);
      setTotalRevenueEachPackageYear(res.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message?.error || "Failed to fetch revenue by package.");
    } finally {
      setLoading(false);
    }
  };

  // Tháng - Doanh thu theo subscription plan
  const fetchRevenueEachPackageMonth = async () => {
    if (!subcriptionPlansIdMonth || !monthSubcriptionPlans || !yearSubcriptionPlansMonth) {
      toast.warning("Please fill all fields for monthly subscription plan revenue.");
      return;
    }
    setLoadingMonthRevenue(true);
    try {
      const res = await getRevenueEachPackageMonth(subcriptionPlansIdMonth, monthSubcriptionPlans, yearSubcriptionPlansMonth);
      setTotalRevenueEachPackageMonth(res.data.data);
    } catch (err) {
      toast.error(err?.response?.data?.message?.error || "Failed to fetch monthly revenue.");
    } finally {
      setLoadingMonthRevenue(false);
    }
  };

  useEffect(() => {
    fetchPaymentYear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  useEffect(() => {
    fetchPaymentMonth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearAndMonth, month]);

  useEffect(() => {
    refreshVisitorAnalytics();
    fetchTransactionAnalytics();
  }, []);

  return (
    <div className="statistics-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <Title level={2} className="page-title">
          <BarChartOutlined className="title-icon" />
          Revenue Analytics Dashboard
        </Title>
        <Text type="secondary" className="page-subtitle">
          Comprehensive financial insights and performance metrics
        </Text>
      </div>

      {/* Overview Cards */}
      <Row gutter={[24, 24]} className="overview-section">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card yearly-card">
            <Statistic
              title="Annual Revenue"
              value={totalPaymentYear}
              loading={loadingYear}
              prefix={<DollarOutlined />}
              suffix="₫"
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
              formatter={(value) => value ? value.toLocaleString("en-US") : "0"}
            />
            <div className="stat-meta">
              <Text type="secondary">Year {year}</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card monthly-card">
            <Statistic
              title="Monthly Revenue"
              value={totalPaymentMonth}
              loading={loadingMonth}
              prefix={<CalendarOutlined />}
              suffix="₫"
              valueStyle={{ color: '#52c41a', fontSize: '24px' }}
              formatter={(value) => value ? value.toLocaleString("en-US") : "0"}
            />
            <div className="stat-meta">
              <Text type="secondary">
                {month ? `Month ${month}/${yearAndMonth}` : "Select month"}
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card package-year-card">
            <Statistic
              title="Package Revenue (Y)"
              value={totalRevenueEachPackageYear}
              loading={loading}
              // prefix={<TrendingUpOutlined />}
              suffix="₫"
              valueStyle={{ color: '#722ed1', fontSize: '24px' }}
              formatter={(value) => value ? value.toLocaleString("en-US") : "0"}
            />
            <div className="stat-meta">
              <Text type="secondary">Plan ID: {subcriptionPlansId || "N/A"}</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card package-month-card">
            <Statistic
              title="Package Revenue (M)"
              value={totalRevenueEachPackageMonth}
              loading={loadingMonthRevenue}
              prefix={<LineChartOutlined />}
              suffix="₫"
              valueStyle={{ color: '#fa8c16', fontSize: '24px' }}
              formatter={(value) => value ? value.toLocaleString("en-US") : "0"}
            />
            <div className="stat-meta">
              <Text type="secondary">Plan ID: {subcriptionPlansIdMonth || "N/A"}</Text>
            </div>
          </Card>
        </Col>
      </Row>
         {/* Transaction Analytics Section */}
      <Row gutter={[24, 24]} className="transaction-section" style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card 
            title={
              <Space>
                <CreditCardOutlined />
                <span>Transaction Analytics</span>
              </Space>
            }
            className="transaction-header-card"
            extra={
              <Button 
                icon={<ReloadOutlined />} 
                onClick={fetchTransactionAnalytics}
                loading={loadingTransactions}
                type="text"
              />
            }
          >
            <Row gutter={[16, 16]}>
              {/* Transaction Overview Stats */}
              <Col xs={24} sm={6}>
                <div className="transaction-stat-card">
                  <Statistic
                    title="Total Revenue"
                    value={transactionStats.totalRevenue}
                    precision={0}
                    prefix={<DollarOutlined />}
                    suffix="VND"
                    valueStyle={{ color: '#3f8600', fontSize: '24px' }}
                  />
                </div>
              </Col>
              <Col xs={24} sm={6}>
                <div className="transaction-stat-card">
                  <Statistic
                    title="Total Transactions"
                    value={transactionStats.totalTransactions}
                    prefix={<ShoppingCartOutlined />}
                    valueStyle={{ color: '#1890ff', fontSize: '24px' }}
                  />
                </div>
              </Col>
              <Col xs={24} sm={6}>
                <div className="transaction-stat-card">
                  <Statistic
                    title="Average Transaction"
                    value={transactionStats.avgTransactionValue}
                    precision={0}
                    prefix={<BankOutlined />}
                    suffix="VND"
                    valueStyle={{ color: '#722ed1', fontSize: '24px' }}
                  />
                </div>
              </Col>
              <Col xs={24} sm={6}>
                <div className="transaction-stat-card">
                  <Statistic
                    title="Success Rate"
                    value={100}
                    precision={1}
                    prefix={<CheckCircleOutlined />}
                    suffix="%"
                    valueStyle={{ color: '#52c41a', fontSize: '24px' }}
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Transaction Details */}
      <Row gutter={[24, 24]} className="transaction-details-section" style={{ marginTop: 24 }}>
        {/* Payment Methods Breakdown */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <CreditCardOutlined />
                <span>Payment Methods</span>
              </Space>
            }
            className="transaction-card"
          >
            <div className="payment-methods">
              {Object.entries(transactionStats.paymentMethods).map(([method, count]) => (
                <div key={method} className="payment-method-item">
                  <div className="payment-method-info">
                    <Tag color={method === 'VNPAY' ? 'blue' : method === 'MOMO' ? 'pink' : 'green'}>
                      {method}
                    </Tag>
                    <Text strong>{count} transactions</Text>
                  </div>
                  <Progress 
                    percent={Math.round((count / transactionStats.totalTransactions) * 100)} 
                    size="small" 
                    showInfo={false}
                    strokeColor={method === 'VNPAY' ? '#1890ff' : method === 'MOMO' ? '#eb2f96' : '#52c41a'}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Subscription Plans Revenue */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <ShoppingCartOutlined />
                <span>Subscription Plans</span>
              </Space>
            }
            className="transaction-card"
          >
            <div className="subscription-plans">
              {Object.entries(transactionStats.subscriptionPlans).map(([plan, revenue]) => (
                <div key={plan} className="subscription-plan-item">
                  <div className="plan-info">
                    <Text strong>{plan}</Text>
                    <Text type="secondary">{revenue.toLocaleString()} VND</Text>
                  </div>
                  <Progress 
                    percent={Math.round((revenue / transactionStats.totalRevenue) * 100)} 
                    size="small" 
                    showInfo={false}
                    strokeColor="#722ed1"
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>

        {/* Recent Transactions */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <BankOutlined />
                <span>Recent Transactions</span>
              </Space>
            }
            className="transaction-card"
          >
            <div className="recent-transactions">
              {transactionStats.recentTransactions.map((transaction) => (
                <div key={transaction.paymentId} className="transaction-item">
                  <div className="transaction-info">
                    <div className="transaction-header">
                      <Text strong>{transaction.username}</Text>
                      <Tag color="green">{transaction.paymentStatus}</Tag>
                    </div>
                    <div className="transaction-details">
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {transaction.subscriptionPlanName} • {transaction.paymentMethod}
                      </Text>
                      <Text strong style={{ color: '#3f8600' }}>
                        {transaction.totalMoney.toLocaleString()} VND
                      </Text>
                    </div>
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      {new Date(transaction.paidAt).toLocaleDateString('vi-VN')}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
      {/* Visitor Analytics Section */}
      <Divider orientation="left" style={{ fontSize: '18px', fontWeight: 'bold', margin: '40px 0 20px' }}>
        <EyeOutlined style={{ marginRight: 8 }} />
        Website Traffic Analytics
      </Divider>

      {/* Visitor Overview Cards */}
      <Row gutter={[24, 24]} className="visitor-overview-section">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card visitor-today-card">
            <Statistic
              title="Today's Page Views"
              value={visitorAnalytics?.todayPageViews || 0}
              loading={refreshing}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#13c2c2', fontSize: '24px' }}
            />
            <div className="stat-meta">
              <Text type="secondary">Unique: {visitorAnalytics?.todayUniqueVisitors || 0}</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card visitor-week-card">
            <Statistic
              title="This Week"
              value={visitorAnalytics?.weekPageViews || 0}
              loading={refreshing}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: '24px' }}
            />
            <div className="stat-meta">
              <Text type="secondary">Unique: {visitorAnalytics?.weekUniqueVisitors || 0}</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card visitor-month-card">
            <Statistic
              title="This Month"
              value={visitorAnalytics?.monthPageViews || 0}
              loading={refreshing}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
            />
            <div className="stat-meta">
              <Text type="secondary">Unique: {visitorAnalytics?.monthUniqueVisitors || 0}</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card visitor-total-card">
            <Statistic
              title="Total Page Views"
              value={visitorAnalytics?.totalPageViews || 0}
              loading={refreshing}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#722ed1', fontSize: '24px' }}
            />
            <div className="stat-meta">
              <Text type="secondary">All time visitors</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Visitor Analytics Details */}
      <Row gutter={[24, 24]} className="visitor-details-section" style={{ marginTop: 24 }}>
        {/* Most Visited Pages */}
      

        {/* Browser & Device Stats */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <DesktopOutlined />
                <span>Browser & Device</span>
              </Space>
            }
            className="visitor-card"
          >
            <div className="browser-device-stats">
              <div className="stat-section">
                <Text strong>Browsers:</Text>
                <div className="stat-items">
                  {visitorAnalytics?.browserStats?.browsers?.map((browser) => (
                    <div key={browser.name} className="stat-item">
                      <Tag color="blue">{browser.name}</Tag>
                      <span>{browser.count}</span>
                    </div>
                  )) || []}
                </div>
              </div>
              
              <Divider style={{ margin: '16px 0' }} />
              
              <div className="stat-section">
                <Text strong>Devices:</Text>
                <div className="stat-items">
                  {visitorAnalytics?.browserStats?.devices?.map((device) => (
                    <div key={device.name} className="stat-item">
                      <Tag color={device.name === 'Mobile' ? 'green' : device.name === 'Tablet' ? 'orange' : 'purple'}>
                        {device.name === 'Mobile' ? <MobileOutlined /> : <DesktopOutlined />}
                        {device.name}
                      </Tag>
                      <span>{device.count}</span>
                    </div>
                  )) || []}
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Visitor Actions */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <BarChartOutlined />
                <span>Analytics Actions</span>
              </Space>
            }
            className="visitor-card"
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                type="primary" 
                icon={<ReloadOutlined />}
                onClick={refreshVisitorAnalytics}
                loading={refreshing}
                style={{ width: '100%' }}
              >
                Refresh Analytics
              </Button>
              
              <Button 
                icon={<DownloadOutlined />}
                onClick={handleExportVisitorData}
                style={{ width: '100%' }}
              >
                Export Data
              </Button>
              
              <Button 
                danger
                icon={<DeleteOutlined />}
                onClick={handleClearVisitorData}
                style={{ width: '100%' }}
              >
                Clear All Data
              </Button>
              
              <div className="analytics-summary">
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Last updated: {new Date().toLocaleTimeString()}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

   

      {/* Control Panels */}
      <Row gutter={[24, 24]} className="control-section">
        {/* Yearly Payment Controls */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <BarChartOutlined />
                <span>Annual Revenue Analysis</span>
              </Space>
            }
            className="control-card"
            extra={
              <Button 
                icon={<ReloadOutlined />} 
                onClick={fetchPaymentYear}
                loading={loadingYear}
                type="text"
              />
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="control-group">
                <Text strong>Select Year:</Text>
                <Select 
                  value={year} 
                  style={{ width: '100%', marginTop: 8 }} 
                  onChange={setYear}
                  size="large"
                >
                  {yearList.map((y) => (
                    <Option key={y} value={y}>{y}</Option>
                  ))}
                </Select>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Monthly Payment Controls */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <CalendarOutlined />
                <span>Monthly Revenue Analysis</span>
              </Space>
            }
            className="control-card"
            extra={
              <Button 
                icon={<ReloadOutlined />} 
                onClick={fetchPaymentMonth}
                loading={loadingMonth}
                type="text"
              />
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="control-group">
                <Text strong>Year:</Text>
                <Select 
                  value={yearAndMonth} 
                  style={{ width: '100%', marginTop: 8 }} 
                  onChange={setYearAndMonth}
                  size="large"
                >
                  {yearList.map((y) => (
                    <Option key={y} value={y}>{y}</Option>
                  ))}
                </Select>
              </div>

              <div className="control-group">
                <Text strong>Month:</Text>
                <Select 
                  placeholder="Select month" 
                  style={{ width: '100%', marginTop: 8 }} 
                  onChange={setMonth}
                  value={month}
                  size="large"
                >
                  {[...Array(12)].map((_, i) => (
                    <Option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('en', { month: 'long' })}
                    </Option>
                  ))}
                </Select>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Package Revenue Analysis */}
      <Row gutter={[24, 24]} className="package-section">
        {/* Yearly Package Revenue */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                {/* <TrendingUpOutlined /> */}
                <span>Subscription Plan Revenue (Annual)</span>
              </Space>
            }
            className="control-card"
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="control-group">
                <Text strong>Subscription Plan ID:</Text>
                <Input
                  placeholder="Enter plan ID"
                  value={subcriptionPlansId}
                  onChange={(e) => setSubcriptionPlansId(e.target.value)}
                  style={{ marginTop: 8 }}
                  size="large"
                />
              </div>

              <div className="control-group">
                <Text strong>Year:</Text>
                <Select 
                  placeholder="Select year" 
                  style={{ width: '100%', marginTop: 8 }} 
                  onChange={setYearSubcriptionPlans}
                  value={yearSubcriptionPlans}
                  size="large"
                >
                  {yearList.map((y) => (
                    <Option key={y} value={y}>{y}</Option>
                  ))}
                </Select>
              </div>

              <Button 
                type="primary" 
                loading={loading} 
                onClick={fetchRevenueEachPackageYear}
                icon={<SearchOutlined />}
                size="large"
                style={{ width: '100%', marginTop: 16 }}
              >
                Analyze Annual Revenue
              </Button>
            </Space>
          </Card>
        </Col>

        {/* Monthly Package Revenue */}
        <Col xs={24} lg={12}>
          <Card 
            title={
              <Space>
                <LineChartOutlined />
                <span>Subscription Plan Revenue (Monthly)</span>
              </Space>
            }
            className="control-card"
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="control-group">
                <Text strong>Subscription Plan ID:</Text>
                <Input
                  placeholder="Enter plan ID"
                  value={subcriptionPlansIdMonth}
                  onChange={(e) => setSubcriptionPlansIdMonth(e.target.value)}
                  style={{ marginTop: 8 }}
                  size="large"
                />
              </div>

              <div className="control-group">
                <Text strong>Year:</Text>
                <Select 
                  placeholder="Select year" 
                  style={{ width: '100%', marginTop: 8 }} 
                  onChange={setYearSubcriptionPlansMonth}
                  value={yearSubcriptionPlansMonth}
                  size="large"
                >
                  {yearList.map((y) => (
                    <Option key={y} value={y}>{y}</Option>
                  ))}
                </Select>
              </div>

              <div className="control-group">
                <Text strong>Month:</Text>
                <Select 
                  placeholder="Select month" 
                  style={{ width: '100%', marginTop: 8 }} 
                  onChange={setMonthSubcriptionPlans}
                  value={monthSubcriptionPlans}
                  size="large"
                >
                  {[...Array(12)].map((_, i) => (
                    <Option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString('en', { month: 'long' })}
                    </Option>
                  ))}
                </Select>
              </div>

              <Button 
                type="primary" 
                loading={loadingMonthRevenue} 
                onClick={fetchRevenueEachPackageMonth}
                icon={<SearchOutlined />}
                size="large"
                style={{ width: '100%', marginTop: 16 }}
              >
                Analyze Monthly Revenue
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatisticsManagement;
