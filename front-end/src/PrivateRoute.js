import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Assuming useAuth is the hook that provides auth status

const PrivateRoute = ({ element, ...rest }) => {
  const { isAuthenticated } = useAuth(); // Check if the user is authenticated

  // Render the element if authenticated, otherwise redirect to the login page
  return isAuthenticated ? element : <Navigate to="/" />;
};

export default PrivateRoute;
