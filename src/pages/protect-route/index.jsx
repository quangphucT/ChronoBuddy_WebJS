import { Navigate } from 'react-router-dom';

import { useSelector } from 'react-redux';



const PublicRoute = ({ children }) => {
  const token = useSelector((store) => store?.user?.token); // hoặc state.auth.user
  return token ? <Navigate to="/home" replace /> : children;
};

export default PublicRoute;