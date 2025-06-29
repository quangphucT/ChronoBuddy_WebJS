import { useEffect, useState } from 'react';
import './index.scss';
import { toast } from 'react-toastify';
import { getPaymentYear } from '../../../../apis/getPaymentYearApi';
import { getPaymentMonth } from '../../../../apis/getPaymentMonthApi';
import { getRevenueEachPackageYear } from '../../../../apis/getRevenueEachPackageYearApi';
import { getRevenueEachPackageMonth } from '../../../../apis/getRevenueEachPackageMonthApi';
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
  DatePicker
} from 'antd';
import { 
  BarChartOutlined, 
  CalendarOutlined, 
  DollarOutlined,
  // TrendingUpOutlined,
  SearchOutlined,
  ReloadOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { Title, Text } = Typography;

const StatisticsManagement = () => {
  const yearList = [2022, 2023, 2024, 2025];

  const [totalPaymentYear, setTotalPaymentYear] = useState(null);
  const [totalPaymentMonth, setTotalPaymentMonth] = useState(null);
  const [totalRevenueEachPackageYear, setTotalRevenueEachPackageYear] = useState(null);
  const [totalRevenueEachPackageMonth, setTotalRevenueEachPackageMonth] = useState(null);

  const [loadingYear, setLoadingYear] = useState(false);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMonthRevenue, setLoadingMonthRevenue] = useState(false);

  const [year, setYear] = useState(new Date().getFullYear());
  const [yearAndMonth, setYearAndMonth] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(null);

  const [subcriptionPlansId, setSubcriptionPlansId] = useState('');
  const [yearSubcriptionPlans, setYearSubcriptionPlans] = useState(null);

  const [subcriptionPlansIdMonth, setSubcriptionPlansIdMonth] = useState('');
  const [monthSubcriptionPlans, setMonthSubcriptionPlans] = useState(null);
  const [yearSubcriptionPlansMonth, setYearSubcriptionPlansMonth] = useState(null);

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
