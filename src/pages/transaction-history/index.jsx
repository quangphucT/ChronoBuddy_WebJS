import { useSelector } from 'react-redux';
import './index.scss'
import { getPaymentUserHistory } from '../../apis/getHistoryPaymentUserApi';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Card, Col, Table } from 'antd';
const TransactionHistory = () => {
    const [loading, setLoading] = useState(false)
      const user_id = useSelector((store) => store?.user?.id);
  const [historyPayment, setHistoryPayment] = useState([])
     
      const fetchPaymentHistoryUser = async () => {
        setLoading(true)
    try {
      const response = await getPaymentUserHistory(user_id);
      setHistoryPayment(response.data.data);
    } catch (error) {
      toast.error(error?.response?.data?.message?.error);
    }
    setLoading(false)
  };
  useEffect(() => {
    fetchPaymentHistoryUser();
  }, []);
      const paymentColumns = [
  {
    title: "ID",
    dataIndex: "paymentId",
    key: "paymentId",
  },
  {
    title: "Plan",
    dataIndex: "subscriptionPlanName",
    key: "subscriptionPlanName",
  },
  {
    title: "Total (VND)",
    dataIndex: "totalMoney",
    key: "totalMoney",
    render: (money) => money.toLocaleString("vi-VN") + "₫",
  },
  {
    title: "Method",
    dataIndex: "paymentMethod",
    key: "paymentMethod",
  },
  {
    title: "Status",
    dataIndex: "paymentStatus",
    key: "paymentStatus",
    render: (status) => (
      <span style={{ color: status === "PAID" ? "green" : "red" }}>
        {status}
      </span>
    ),
  },
  {
    title: "Paid At",
    dataIndex: "paidAt",
    key: "paidAt",
    render: (text) => new Date(text).toLocaleString(),
  },
];
  return (
  <div className="payment-history-wrapper">
  
      <Card className="payment-history-card">
       <div className="payment-history-title">
  <i className="fas fa-receipt"></i>
  <span>Payment History</span>
</div>

        <Table
          loading={loading}
          columns={paymentColumns}
          dataSource={historyPayment}
          rowKey="paymentId"
          pagination={{ pageSize: 5 }}
        />
      </Card>
  
  </div>
);

}

export default TransactionHistory
