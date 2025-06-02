import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-10">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center">
        {/* Tên và logo ứng dụng */}
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          <span className="text-xl font-bold font-mono text-[#1e88e5]">
            TODOLIST
          </span>
        </div>

        {/* Liên kết footer */}
        <div className="flex space-x-6 text-sm">
          <Link to="#" className="hover:text-[#1e88e5] transition">
            About
          </Link>
          <Link to="#" className="hover:text-[#1e88e5] transition">
            Contact
          </Link>
          <Link to="#" className="hover:text-[#1e88e5] transition">
            Privacy
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-500 pb-4">
        © {new Date().getFullYear()} TODOLIST. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
