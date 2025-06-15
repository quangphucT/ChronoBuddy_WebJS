import { useEffect, useState } from 'react';
import './index.scss';
import { toast } from 'react-toastify';
import { getPaymentYear } from '../../../../apis/getPaymentYearApi';
import { getPaymentMonth } from '../../../../apis/getPaymentMonthApi';
import { getRevenueEachPackageYear } from '../../../../apis/getRevenueEachPackageYearApi';
import { getRevenueEachPackageMonth } from '../../../../apis/getRevenueEachPackageMonthApi';
import { Button, Card, Input, Select, Spin } from 'antd';
import { BarChartOutlined, CalendarOutlined } from '@ant-design/icons';

const { Option } = Select;

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
  }, [year]);

  useEffect(() => {
    fetchPaymentMonth();
  }, [yearAndMonth, month]);

  return (
    <div className="statistics-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {/* Yearly Payment */}
      <Card className="statistics-card">
        <div className="header">
          <BarChartOutlined style={{ fontSize: 28, marginRight: 12 }} />
          <h2>Yearly Payment Statistics</h2>
        </div>

        <div className="select-group">
          <span>Select Year:</span>
          <Select value={year} style={{ width: 120, marginLeft: 10 }} onChange={setYear}>
            {yearList.map((y) => <Option key={y} value={y}>{y}</Option>)}
          </Select>
        </div>

        <div className="result">
          {loadingYear ? <Spin size="large" /> : (
            <h3>Total payment this year: <span className="amount">
              {totalPaymentYear !== null ? totalPaymentYear.toLocaleString("en-US") + " ₫" : "No data available"}
            </span></h3>
          )}
        </div>
      </Card>

      {/* Monthly Payment */}
      <Card className="statistics-card">
        <div className="header">
          <CalendarOutlined style={{ fontSize: 26, marginRight: 12 }} />
          <h2>Monthly Payment Statistics</h2>
        </div>

        <div className="select-group">
          <span>Year:</span>
          <Select value={yearAndMonth} style={{ width: 120, margin: '0 10px' }} onChange={setYearAndMonth}>
            {yearList.map((y) => <Option key={y} value={y}>{y}</Option>)}
          </Select>

          <span>Month:</span>
          <Select placeholder="Month" style={{ width: 120, marginLeft: 10 }} onChange={setMonth}>
            {[...Array(12)].map((_, i) => (
              <Option key={i + 1} value={i + 1}>Month {i + 1}</Option>
            ))}
          </Select>
        </div>

        <div className="result">
          {loadingMonth ? <Spin size="large" /> : (
            <h3>Total payment this month: <span className="amount">
              {totalPaymentMonth !== null ? totalPaymentMonth.toLocaleString("en-US") + " ₫" : "No data available"}
            </span></h3>
          )}
        </div>
      </Card>

      {/* Subscription Revenue by Year */}
      <Card className="statistics-card">
        <div className="header">
          <BarChartOutlined style={{ fontSize: 26, marginRight: 12 }} />
          <h2>Revenue by Subscription Plan (Year)</h2>
        </div>

        <div className="select-group" style={{ marginBottom: 12 }}>
          <span>ID:</span>
          <Input
            value={subcriptionPlansId}
            onChange={(e) => setSubcriptionPlansId(e.target.value)}
            style={{ width: 150, margin: '0 10px' }}
          />

          <span>Year:</span>
          <Select placeholder="Select year" style={{ width: 120 }} onChange={setYearSubcriptionPlans}>
            {yearList.map((y) => <Option key={y} value={y}>{y}</Option>)}
          </Select>

          <Button loading={loading} onClick={fetchRevenueEachPackageYear} style={{ marginLeft: 10, backgroundColor: '#1e88e5', color: '#fff' }}>
            Search
          </Button>
        </div>

        <div className="result">
          <h3>Revenue: <span className="amount">
            {totalRevenueEachPackageYear !== null ? totalRevenueEachPackageYear.toLocaleString("en-US") + " ₫" : "No data available"}
          </span></h3>
        </div>
      </Card>

      {/* Subscription Revenue by Month */}
      <Card className="statistics-card">
        <div className="header">
          <CalendarOutlined style={{ fontSize: 26, marginRight: 12 }} />
          <h2>Revenue by Subscription Plan (Month)</h2>
        </div>

        <div className="select-group" style={{ marginBottom: 12 }}>
          <span>ID:</span>
          <Input
            value={subcriptionPlansIdMonth}
            onChange={(e) => setSubcriptionPlansIdMonth(e.target.value)}
            style={{ width: 150, margin: '0 10px' }}
          />

          <span>Year:</span>
          <Select placeholder="Select year" style={{ width: 120 }} onChange={setYearSubcriptionPlansMonth}>
            {yearList.map((y) => <Option key={y} value={y}>{y}</Option>)}
          </Select>

          <span>Month:</span>
          <Select placeholder="Select month" style={{ width: 120, marginLeft: 10 }} onChange={setMonthSubcriptionPlans}>
            {[...Array(12)].map((_, i) => (
              <Option key={i + 1} value={i + 1}>Month {i + 1}</Option>
            ))}
          </Select>

          <Button loading={loadingMonthRevenue} onClick={fetchRevenueEachPackageMonth} style={{ marginLeft: 10, backgroundColor: '#1e88e5', color: '#fff' }}>
            Search
          </Button>
        </div>

        <div className="result">
          <h3>Revenue: <span className="amount">
            {totalRevenueEachPackageMonth !== null ? totalRevenueEachPackageMonth.toLocaleString("en-US") + " ₫" : "No data available"}
          </span></h3>
        </div>
      </Card>
    </div>
  );
};

export default StatisticsManagement;
