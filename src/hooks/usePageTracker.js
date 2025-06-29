// src/hooks/usePageTracker.js
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const usePageTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const log = {
      path: location.pathname,
      time: new Date().toLocaleString(),
      userAgent: navigator.userAgent,
    };

    const logs = JSON.parse(localStorage.getItem("pageLogs") || "[]");
    logs.push(log);
    localStorage.setItem("pageLogs", JSON.stringify(logs));
  }, [location]);
};

export default usePageTracker;
