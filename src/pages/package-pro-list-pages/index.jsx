import { Card, Col, Modal, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import "./index.scss";
import { getAllPackagesPro } from "../../apis/getAllPackageProApi";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";
import { paymentCreate } from "../../apis/paymentCreateApi";
import { useSelector } from "react-redux";
import HeroSection from "../../components/atoms/carouselsub_content";
import { useLocation, useNavigate } from "react-router-dom";
import { saveDataToDB } from "../../apis/saveDataToDBApi";

const PageProListPage = () => {
  const [packages, setPackages] = useState([]);
  const [detailsPackage, setDetailsPackages] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const userId = useSelector((store) => store?.user?.id);
  const navigate = useNavigate();
  const location = useLocation();
  const [showPostPaymentModal, setShowPostPaymentModal] = useState(false);

  const handleBuyClick = (pkg) => {
    setSelectedPackage(pkg);
    setBuyModalOpen(true);
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
    setLoading(true)
    try {
      const dataToDB = {
        userId: userId,
        subscriptionPlanId: selectedPackage.id,
      };

      await saveDataToDB(dataToDB);
      localStorage.removeItem("pendingPackage"); // ✅ XÓA SAU KHI LƯU DB
      toast.success("Thanks for your order!");
      setSelectedPackage(null);
      navigate("/home");
    } catch (error) {
      toast.error(error.response.data.message || "Error while handling");
    }
    setLoading(false)
  };
  console.log("selectedPackage", selectedPackage);
  return (
    <div className="px-10 py-6">
      <HeroSection />
      <div className="w-full h-0.5 bg-gray-300 my-4 mt-[-100px]" />

      <h2 className="text-2xl font-bold mb-6">Available Pro Packages</h2>
      <Spin
        spinning={loading}
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <Card
              key={pkg.id}
              title={
                <span className="text-xl font-extrabold text-blue-800">
                  {pkg.name}
                </span>
              }
              className="rounded-lg shadow-md"
              bodyStyle={{ paddingTop: 10 }}
            >
              {/* <p className="text-gray-700 font-medium">{pkg.description}</p> */}
              <p className="mt-2 font-semibold">
                Duration:{" "}
                {pkg.durationDays === -1 ? (
                  <span className="text-green-600">Forever</span>
                ) : (
                  `${pkg.durationDays} days`
                )}
              </p>
              <p className="mt-1 text-gray-500 font-medium">
                Price: {pkg.price.toLocaleString()}₫
              </p>

              <div className="mt-5 flex space-x-3">
                <button
                  onClick={() => handleBuyClick(pkg)}
                  type="button"
                  className="bg-[#7925c8] w-full h-[45px] rounded-2xl cursor-pointer text-white font-semibold 
  transition-transform duration-300 transform hover:scale-90"
                >
                  Buy Now
                </button>

                <button
                  onClick={() => {
                    showModal(pkg);
                  }}
                  className="text-black  font-semibold w-[100px] cursor-pointer rounded-4xl hover:text-[16px]"
                >
                  Details
                </button>
              </div>
            </Card>
          ))}
        </div>
      </Spin>

      <Modal
        title="Package Details"
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        footer={null}
      >
        {detailsPackage && (
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {detailsPackage.name}
            </p>
            <p>
              <strong>Description:</strong> {detailsPackage.description}
            </p>
            <p>
              <strong>Duration:</strong>{" "}
              {detailsPackage.durationDays === -1
                ? "Forever"
                : `${detailsPackage.durationDays} days`}
            </p>
            <p>
              <strong>Price:</strong> {detailsPackage.price.toLocaleString()}₫
            </p>
          </div>
        )}
      </Modal>

      <Modal
        title="Confirm Purchase"
        open={buyModalOpen}
        onCancel={() => {
          setBuyModalOpen(false);
          setSelectedPackage(null);
        }}
        onOk={confirmPurchase}
        okText="Yes, Buy"
        cancelText="Cancel"
      >
        {selectedPackage && (
          <p>
            Are you sure you want to buy the{" "}
            <strong>{selectedPackage.name}</strong> package for{" "}
            <strong>{selectedPackage.price.toLocaleString()}₫</strong>?
          </p>
        )}
      </Modal>

      <Modal
        footer={[
          <Button loading={loading} onClick={handleSaveDataToDB}>Oke</Button>
        ]}
        onCancel={handleSaveDataToDB}
        title="Payment Completed"
        open={showPostPaymentModal}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <p>🎉 Your payment was successful! Thank you for your purchase.</p>
      </Modal>

      {redirecting && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center space-y-4 foggy-bg">
          <Spin
            indicator={
              <LoadingOutlined style={{ fontSize: 48, color: "#fff" }} spin />
            }
          />
          <p className="text-white text-xl font-semibold animate-pulse">
            Please waiting a minute...
          </p>
        </div>
      )}
    </div>
  );
};

export default PageProListPage;
