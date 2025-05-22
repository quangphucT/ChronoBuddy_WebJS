
import { Navigate } from 'react-router-dom';

import { useSelector } from 'react-redux';


const PrivateRoute = ({ children} ) => {
    const token = useSelector((store) => store?.user?.token); // hoặc state.auth.user
    const role = useSelector((store) => store?.user?.role);
    if (token && role !== 'ADMIN') {
      return <Navigate to="/home" replace />
    }
    return children
};

export default PrivateRoute;