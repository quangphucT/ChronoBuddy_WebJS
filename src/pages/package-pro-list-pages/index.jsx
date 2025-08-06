import { Button, Card, Col, Modal, Row, Spin, Image, Divider, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import "./index.scss";
import { getAllPackagesPro } from "../../apis/getAllPackageProApi";
import { toast } from "react-toastify";
import { LoadingOutlined, QrcodeOutlined, CreditCardOutlined, BankOutlined, CopyOutlined, CheckCircleOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { paymentCreate } from "../../apis/paymentCreateApi";
import { useDispatch, useSelector } from "react-redux";
import HeroSection from "../../components/atoms/carouselsub_content";
import { useLocation, useNavigate } from "react-router-dom";
import { saveDataToDB } from "../../apis/saveDataToDBApi";
import { removeInformation } from "../../redux/feature/userSlice";
import qrPaymentImage from "../../assets/images/qr_payment.jpg";

const { Title, Text } = Typography;

const PageProListPage = () => {
  const [packages, setPackages] = useState([]);
  const [detailsPackage, setDetailsPackages] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

   const [loadingSuccessBought, setLoadingSuccessBought] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const userId = useSelector((store) => store?.user?.id);
  const role = useSelector((store) => store?.user?.role)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPostPaymentModal, setShowPostPaymentModal] = useState(false);

  const handleBuyClick = (pkg) => {
    setSelectedPackage(pkg);
    setBuyModalOpen(true);
  };

  const handleQRPayment = (pkg) => {
    setSelectedPackage(pkg);
    setQrModalOpen(true);
  };

  // Copy to clipboard function
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copied to clipboard!`);
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const responseCode = params.get("vnp_ResponseCode");
    if (responseCode === "00") {
      const savedPackage = localStorage.getItem("pendingPackage");
      if (savedPackage) {
        setSelectedPackage(JSON.parse(savedPackage));
        setShowPostPaymentModal(true);
      }
    }
  }, [location.search]);

  const confirmPurchase = async () => {
    if(role === "PREMIUM"){
      toast.info("You already have a Premium account.")
      setSelectedPackage(null);
      setBuyModalOpen(false);
      return;
    }else{
 try {
      setRedirecting(true);
      const dataAfterFilter = {
        userId: userId,
        subscriptionPlanId: selectedPackage?.id,
      };

      const response = await paymentCreate(dataAfterFilter);

      const paymentUrl = response.data; // vì trả về trực tiếp chuỗi URL

      if (paymentUrl) {
        localStorage.setItem("pendingPackage", JSON.stringify(selectedPackage));
        window.location.href = paymentUrl; // 🔁 Redirect sang VNPay
      } else {
        toast.error("Không nhận được link thanh toán.");
        setRedirecting(false);
      }

      setSelectedPackage(null);
      setBuyModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error while handling");
      setRedirecting(false);
    }
    }
   
  };

  const fetchingData = async () => {
    setLoading(true);
    try {
      const response = await getAllPackagesPro();

      setPackages(response.data.data);
    } catch (error) {
      toast.error(error.response.data.message || "Error while fetching!");
    }
    setLoading(false);
  };
  const showModal = (pkg) => {
    setDetailsPackages(pkg);
    setOpen(true);
  };
  useEffect(() => {
    fetchingData();
  }, []);
  const handleSaveDataToDB = async () => {
    setLoadingSuccessBought(true)
    try {
       const params = new URLSearchParams(location.search);
       const responseCode = params.get("vnp_ResponseCode");
       const dataToDB = {
        userId: userId,
        subscriptionPlanId: selectedPackage.id,
        vnp_ResponseCode: responseCode,
      };

      await saveDataToDB(dataToDB);
      localStorage.removeItem("pendingPackage"); // ✅ XÓA SAU KHI LƯU DB
      toast.success("Thanks for your buying!");
      setSelectedPackage(null);
      dispatch(removeInformation());
      localStorage.removeItem("token");
      navigate("/login-page");
      toast.warn("Please login again to experience a new version!!!")
    } catch (error) {
      toast.error(error.response.data.message || "Error while handling");
    }
    setLoadingSuccessBought(false)
  };
  return (
    <div className="professional-package-page">
      {/* <HeroSection /> */}
      
      {/* Professional Header Section */}
      <div className="packages-header-section">
        <div className="header-background">
          <div className="header-overlay"></div>
          <div className="header-content">
            <div className="header-text">
              <Title level={1} className="main-title">
                Choose Your Perfect Plan
              </Title>
              <Text className="subtitle">
                Unlock premium features and supercharge your productivity with ChronoBuddy Pro
              </Text>
            </div>
            <div className="header-stats">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Package Cards Section */}
      <div className="packages-section">
        <div className="packages-container">
          <Spin
            spinning={loading}
            indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
          >
            <div className="packages-grid">
              {packages.map((pkg, index) => (
                <div 
                  key={pkg.id} 
                  className={`package-card-wrapper ${index === 1 ? 'featured-package' : ''}`}
                >
                  {index === 1 && (
                    <div className="featured-badge">
                      <span>Most Popular</span>
                    </div>
                  )}
                  
                  <Card
                    className="professional-package-card"
                    bodyStyle={{ padding: 0 }}
                  >
                    <div className="package-header">
                      <div className="package-icon">
                        <CreditCardOutlined />
                      </div>
                      <Title level={3} className="package-title">
                        {pkg.name}
                      </Title>
                      <Text className="package-description">
                        {pkg.description || "Premium features for enhanced productivity"}
                      </Text>
                    </div>

                    <div className="package-pricing">
                      <div className="price-display">
                        <span className="currency">₫</span>
                        <span className="price">{pkg.price.toLocaleString()}</span>
                      </div>
                      <div className="duration-info">
                        {pkg.durationDays === -1 ? (
                          <span className="duration-forever">Lifetime Access</span>
                        ) : (
                          <span className="duration-limited">{pkg.durationDays} days</span>
                        )}
                      </div>
                    </div>

                    <div className="package-features">
                      <div className="feature-item">
                        <CheckCircleOutlined className="feature-icon" />
                        <span>Advanced Task Management</span>
                      </div>
                      <div className="feature-item">
                        <CheckCircleOutlined className="feature-icon" />
                        <span>Team Collaboration Tools</span>
                      </div>
                      <div className="feature-item">
                        <CheckCircleOutlined className="feature-icon" />
                        <span>Priority Customer Support</span>
                      </div>
                      <div className="feature-item">
                        <CheckCircleOutlined className="feature-icon" />
                        <span>Advanced Analytics & Reports</span>
                      </div>
                    </div>

                    <div className="package-actions">
                      <div className="payment-buttons">
                        <Button
                          type="primary"
                          size="large"
                          icon={<CreditCardOutlined />}
                          onClick={() => handleBuyClick(pkg)}
                          className="vnpay-button"
                        >
                          Pay with VNPay
                        </Button>
                        
                        <Button
                          size="large"
                          icon={<QrcodeOutlined />}
                          onClick={() => handleQRPayment(pkg)}
                          className="qr-button"
                        >
                          Pay with QR
                        </Button>
                      </div>
                      
                      <Button
                        type="text"
                        onClick={() => showModal(pkg)}
                        className="details-button"
                      >
                        View Details →
                      </Button>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </Spin>
        </div>
      </div>

      {/* Trust & Security Section */}
      <div className="trust-section">
        <div className="trust-container">
          <div className="trust-header">
            <Title level={2} className="trust-title">
              Trusted by Professionals Worldwide
            </Title>
            <Text className="trust-subtitle">
              Join thousands of satisfied customers who have upgraded their productivity
            </Text>
          </div>
          
          <div className="trust-features">
            <div className="trust-item">
              <div className="trust-icon">
                <SafetyCertificateOutlined />
              </div>
              <div className="trust-content">
                <Title level={4}>Secure Payments</Title>
                <Text>256-bit SSL encryption and secure payment processing</Text>
              </div>
            </div>
            
            <div className="trust-item">
              <div className="trust-icon">
                <CheckCircleOutlined />
              </div>
              <div className="trust-content">
                <Title level={4}>30-Day Guarantee</Title>
                <Text>Not satisfied? Get your money back, no questions asked</Text>
              </div>
            </div>
            
            <div className="trust-item">
              <div className="trust-icon">
                <BankOutlined />
              </div>
              <div className="trust-content">
                <Title level={4}>Instant Activation</Title>
                <Text>Your premium features activate immediately after payment</Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Package Details Modal */}
      <Modal
        title={null}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={500}
        centered
        className="professional-details-modal"
        bodyStyle={{ padding: 0 }}
      >
        {detailsPackage && (
          <div className="package-details-content">
            <div className="details-header">
              <div className="package-icon-large">
                <CreditCardOutlined />
              </div>
              <div className="details-title-section">
                <Title level={2} className="details-title">
                  {detailsPackage.name}
                </Title>
                <Text className="details-subtitle">
                  Premium Package Details
                </Text>
              </div>
            </div>
            
            <div className="details-body">
              <div className="detail-item">
                <div className="detail-label">
                  <Text strong>Package Name</Text>
                </div>
                <div className="detail-value">
                  <Text>{detailsPackage.name}</Text>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">
                  <Text strong>Description</Text>
                </div>
                <div className="detail-value">
                  <Text>{detailsPackage.description || "Enhanced productivity features and premium support"}</Text>
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">
                  <Text strong>Duration</Text>
                </div>
                <div className="detail-value">
                  {detailsPackage.durationDays === -1 ? (
                    <span className="duration-forever">
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                      Lifetime Access
                    </span>
                  ) : (
                    <span className="duration-limited">
                      {detailsPackage.durationDays} days
                    </span>
                  )}
                </div>
              </div>
              
              <div className="detail-item">
                <div className="detail-label">
                  <Text strong>Investment</Text>
                </div>
                <div className="detail-value">
                  <div className="price-display-modal">
                    <span className="price-large">
                      {detailsPackage.price.toLocaleString()}₫
                    </span>
                    <span className="price-note">One-time payment</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="details-footer">
              <Button 
                size="large" 
                onClick={() => setOpen(false)}
                className="close-details-btn"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Professional Confirm Purchase Modal */}
      <Modal
        title={null}
        open={buyModalOpen}
        onCancel={() => {
          setBuyModalOpen(false);
          setSelectedPackage(null);
        }}
        footer={null}
        width={500}
        centered
        className="professional-confirm-modal"
        bodyStyle={{ padding: 0 }}
      >
        {selectedPackage && (
          <div className="confirm-purchase-content">
            <div className="confirm-header">
              <div className="confirm-icon">
                <CreditCardOutlined />
              </div>
              <div className="confirm-title-section">
                <Title level={2} className="confirm-title">
                  Confirm Your Purchase
                </Title>
                <Text className="confirm-subtitle">
                  You're about to upgrade to premium
                </Text>
              </div>
            </div>
            
            <div className="confirm-body">
              <div className="package-summary">
                <div className="summary-item">
                  <Text className="summary-label">Package:</Text>
                  <Text className="summary-value" strong>{selectedPackage.name}</Text>
                </div>
                <div className="summary-item">
                  <Text className="summary-label">Duration:</Text>
                  <Text className="summary-value">
                    {selectedPackage.durationDays === -1 ? 'Lifetime' : `${selectedPackage.durationDays} days`}
                  </Text>
                </div>
                <div className="summary-item total-item">
                  <Text className="summary-label">Total Amount:</Text>
                  <Text className="summary-value total-price">
                    {selectedPackage.price.toLocaleString()}₫
                  </Text>
                </div>
              </div>
              
              <div className="payment-method-info">
                <div className="payment-info-item">
                  <SafetyCertificateOutlined className="info-icon" />
                  <Text>Secure payment via VNPay gateway</Text>
                </div>
                <div className="payment-info-item">
                  <CheckCircleOutlined className="info-icon" />
                  <Text>Instant activation after successful payment</Text>
                </div>
              </div>
            </div>
            
            <div className="confirm-footer">
              <Button 
                size="large" 
                onClick={() => {
                  setBuyModalOpen(false);
                  setSelectedPackage(null);
                }}
                className="cancel-btn"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                onClick={confirmPurchase}
                className="confirm-btn"
                loading={redirecting}
              >
                {redirecting ? 'Processing...' : 'Proceed to Payment'}
              </Button>
            </div>
          </div>
        )}
      </Modal>



      {/* Professional Success Modal */}
      <Modal
        title={null}
        open={showPostPaymentModal}
        onCancel={handleSaveDataToDB}
        footer={null}
        width={500}
        centered
        className="professional-success-modal"
        bodyStyle={{ padding: 0 }}
        closable={false}
      >
        <div className="success-content">
          <div className="success-header">
            <div className="success-icon">
              <CheckCircleOutlined />
            </div>
            <div className="success-title-section">
              <Title level={2} className="success-title">
                Payment Successful!
              </Title>
              <Text className="success-subtitle">
                Welcome to ChronoBuddy Premium
              </Text>
            </div>
          </div>
          
          <div className="success-body">
            <div className="success-message">
              <Text>
                🎉 Congratulations! Your payment has been processed successfully. 
                Your premium features are now being activated.
              </Text>
            </div>
            
            <div className="success-features">
              <div className="feature-item">
                <CheckCircleOutlined className="feature-icon" />
                <Text>Premium features unlocked</Text>
              </div>
              <div className="feature-item">
                <CheckCircleOutlined className="feature-icon" />
                <Text>Priority customer support</Text>
              </div>
              <div className="feature-item">
                <CheckCircleOutlined className="feature-icon" />
                <Text>Advanced analytics & reports</Text>
              </div>
            </div>
          </div>
          
          <div className="success-footer">
            <Button
              type="primary"
              size="large"
              onClick={handleSaveDataToDB}
              loading={loadingSuccessBought}
              className="continue-btn"
            >
              {loadingSuccessBought ? 'Activating...' : 'Continue to Dashboard'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* QR Payment Modal - Professional Design */}
      <Modal
        title={null}
        open={qrModalOpen}
        onCancel={() => {
          setQrModalOpen(false);
          setSelectedPackage(null);
        }}
        footer={null}
        width={600}
        centered
        className="professional-qr-modal"
        bodyStyle={{ padding: 0 }}
      >
        {selectedPackage && (
          <div className="qr-payment-professional">
            {/* Header Section */}
            <div className="qr-modal-header">
              <div className="header-content">
                <div className="icon-section">
                  <div className="qr-icon-wrapper">
                    <QrcodeOutlined />
                  </div>
                </div>
                <div className="header-text">
                  <Title level={3} className="payment-title">
                    QR Code Payment
                  </Title>
                  <Text className="payment-subtitle">
                    Secure & Fast Bank Transfer
                  </Text>
                </div>
                <div className="security-badge">
                  <SafetyCertificateOutlined />
                  <span>Secure</span>
                </div>
              </div>
            </div>

            {/* Package Info */}
            <div className="package-info-section">
              <div className="package-card">
                <div className="package-details">
                  <Title level={4} className="package-name">
                    {selectedPackage.name}
                  </Title>
                  <div className="price-display">
                    <span className="price-amount">
                      {selectedPackage.price.toLocaleString()}
                    </span>
                    <span className="currency">₫</span>
                  </div>
                </div>
                <div className="package-badge">
                  <CreditCardOutlined />
                  <span>Premium</span>
                </div>
              </div>
            </div>

            <Divider className="elegant-divider" />

            {/* QR Code Section */}
            <div className="qr-code-section">
              <div className="qr-instruction">
                <Title level={5} className="instruction-title">
                  <BankOutlined className="bank-icon" />
                  Scan QR Code with Banking App
                </Title>
                <Text className="instruction-text">
                  Use your mobile banking app to scan the QR code below
                </Text>
              </div>

              <div className="qr-display-area">
                <div className="qr-container">
                  <div className="qr-frame">
                    <Image
                      src={qrPaymentImage}
                      alt="ChronoBuddy Payment QR Code"
                      width={220}
                      height={220}
                      preview={false}
                      className="qr-image"
                    />
                    <div className="qr-overlay">
                      <div className="scan-animation"></div>
                    </div>
                  </div>
                  <div className="qr-label">
                    <CheckCircleOutlined className="verified-icon" />
                    <span>Official ChronoBuddy QR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Information */}
            <div className="bank-info-section">
              <div className="bank-card">
                <div className="bank-header">
                  <BankOutlined className="bank-logo" />
                  <div className="bank-details">
                    <Title level={5} className="bank-name">Sacombank</Title>
                    <Text className="bank-subtitle">Vietnam Commercial Bank</Text>
                  </div>
                </div>
                
                <div className="account-details">
                  <div className="detail-row">
                    <Text className="detail-label">Account Number:</Text>
                    <div className="detail-value">
                      <Text className="account-number">0335785107</Text>
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard('1234567890', 'Account number')}
                        className="copy-btn"
                      />
                    </div>
                  </div>
                  
                  <div className="detail-row">
                    <Text className="detail-label">Account Name:</Text>
                    <div className="detail-value">
                      <Text className="account-name">CHRONOBUDDY COMPANY</Text>
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard('CHRONOBUDDY COMPANY', 'Account name')}
                        className="copy-btn"
                      />
                    </div>
                  </div>
                  
                  <div className="detail-row">
                    <Text className="detail-label">Transfer Amount:</Text>
                    <div className="detail-value">
                      <Text className="transfer-amount">
                        {selectedPackage.price.toLocaleString()}₫
                      </Text>
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(selectedPackage.price.toString(), 'Amount')}
                        className="copy-btn"
                      />
                    </div>
                  </div>
                  
                  <div className="detail-row">
                    <Text className="detail-label">Transfer Message:</Text>
                    <div className="detail-value">
                      <Text className="transfer-message">
                        CHRONOBUDDY {selectedPackage.name} {userId}
                      </Text>
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard(`CHRONOBUDDY ${selectedPackage.name} ${userId}`, 'Transfer message')}
                        className="copy-btn"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="instructions-section">
              <Title level={5} className="instructions-title">
                Payment Instructions
              </Title>
              <div className="step-list">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <Text>Open your mobile banking app</Text>
                </div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <Text>Select QR Payment or Transfer feature</Text>
                </div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <Text>Scan the QR code or enter bank details manually</Text>
                </div>
                <div className="step-item">
                  <div className="step-number">4</div>
                  <Text>Verify amount and transfer message</Text>
                </div>
                <div className="step-item">
                  <div className="step-number">5</div>
                  <Text>Complete the transaction</Text>
                </div>
              </div>
            </div>

            {/* Notice */}
            <div className="notice-section">
              <div className="notice-card">
                <div className="notice-header">
                  <CheckCircleOutlined className="notice-icon" />
                  <Text className="notice-title">Important Notice</Text>
                </div>
                <div className="notice-content">
                  <Text>
                    • Your account will be upgraded automatically within <strong>5-10 minutes</strong> after successful payment
                  </Text>
                  <Text>
                    • Please keep your transaction receipt for verification
                  </Text>
                  <Text>
                    • For immediate support, contact us with your transaction ID
                  </Text>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="modal-footer">
              <Button 
                size="large"
                onClick={() => {
                  setQrModalOpen(false);
                  setSelectedPackage(null);
                }}
                className="close-button"
              >
                Close Payment
              </Button>
            </div>
          </div>
        )}
      </Modal>




      {/* Professional Loading Screen */}
      {redirecting && (
        <div className="professional-loading-screen">
          <div className="loading-content">
            <div className="loading-animation">
              <div className="loading-circle"></div>
              <div className="loading-circle-inner"></div>
            </div>
            <div className="loading-text">
              <Title level={3} className="loading-title">
                Processing Your Payment
              </Title>
              <Text className="loading-subtitle">
                Please wait while we redirect you to the secure payment gateway...
              </Text>
              <div className="loading-steps">
                <div className="step active">
                  <span className="step-number">1</span>
                  <span className="step-text">Preparing payment</span>
                </div>
                <div className="step active">
                  <span className="step-number">2</span>
                  <span className="step-text">Securing connection</span>
                </div>
                <div className="step loading">
                  <span className="step-number">3</span>
                  <span className="step-text">Redirecting to VNPay</span>
                </div>
              </div>
            </div>
          </div>
          <div className="loading-background"></div>
        </div>
      )}
    </div>
  );
};

export default PageProListPage;




