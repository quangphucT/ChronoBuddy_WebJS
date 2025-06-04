import { Card, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import "./index.scss"; 
import { getAllPackagesPro } from "../../apis/getAllPackageProApi";
import { toast } from "react-toastify";
import { LoadingOutlined } from "@ant-design/icons";
import { paymentCreate } from "../../apis/paymentCreateApi";
import { useSelector } from "react-redux";

const PageProListPage = () => {
  const [packages, setPackages] = useState([]);
  const [detailsPackage, setDetailsPackages] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const userId = useSelector((store) => store?.user?.id)
  const handleBuyClick = (pkg) => {
    setSelectedPackage(pkg);
    setBuyModalOpen(true);
  };
  const confirmPurchase = async () => {
  try {
    const dataAfterFilter = {
      userId: userId,
      subscriptionPlanId: selectedPackage?.id,
    };

    const response = await paymentCreate(dataAfterFilter);

    const paymentUrl = response.data; // vì trả về trực tiếp chuỗi URL

    if (paymentUrl) {
      window.location.href = paymentUrl; // 🔁 Redirect sang VNPay
    } else {
      toast.error("Không nhận được link thanh toán.");
    }

    setSelectedPackage(null);
    setBuyModalOpen(false);
  } catch (error) {
    toast.error(error.response?.data?.message || "Error while handling");
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

  return (
    <div className="px-10 py-6">
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
        onCancel={() => {setBuyModalOpen(false); setSelectedPackage(null)}}
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
    </div>
  );
};

export default PageProListPage;
