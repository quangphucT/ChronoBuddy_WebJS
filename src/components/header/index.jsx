import { useEffect, useState } from "react";
import { Image } from "antd";
import "./index.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const imageUrlAfterLogin = useSelector((store) => store?.user?.imageUrl);
  const nameOnRedux = useSelector((store) => store?.user?.name);
  const isHomePage = location.pathname === "/home";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    if (isHomePage) {
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage]);

  const handleNavigate = () => {
    navigate("profile-page");
  };

  const headerClasses =
    isHomePage && !scrolled
      ? "bg-white/15 text-white backdrop-blur"
      : "bg-white text-black shadow-md";

  return (
    <header
      className={`fixed top-0 w-full z-50 px-7 py-1.5 flex items-center justify-between transition-all duration-300 ${headerClasses}`}
    >
      {/* Logo + Title */}
      <div
        className="flex items-center space-x-4 cursor-pointer"
        onClick={() => navigate("/")}
      >

        <h1
          className={`text-[29px] font-extrabold hidden sm:block ${
            isHomePage && !scrolled
              ? "bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 via-blue-400 to-purple-500 bg-clip-text text-transparent"
              : "text-black"
          }`}
        >
          TODOLIST
        </h1>
      </div>

      {/* Account Icon */}
      <div className="flex items-center space-x-5">

          <button
    onClick={() => navigate("PageProListPage")}
    className="bg-gradient-to-r cursor-pointer from-yellow-400 to-red-400 text-white font-semibold px-4 py-1.5 rounded-full hover:brightness-110 transition duration-300"
  >
    Nâng cấp Pro
  </button>
        {imageUrlAfterLogin ? (
          <div className="flex space-x-3.5 items-center">
            <p class="bg-gradient-to-r from-red-200 via-yellow-500 to-blue-500 text-transparent bg-clip-text text-[15px] font-bold">
              {nameOnRedux}
            </p>
            <Image
              src={imageUrlAfterLogin}
              alt="avatar"
              width={40}
              height={40}
              preview={false}
              className="rounded-full cursor-pointer border border-gray-300 hover:shadow-md transition duration-300"
              onClick={handleNavigate}
            />
          </div>
        ) : (
          <UserOutlined
            onClick={handleNavigate}
            className="text-2xl hover:text-[#1e88e5] transition duration-300 cursor-pointer"
          />
        )}
      </div>
    </header>
  );
};

export default Header;
