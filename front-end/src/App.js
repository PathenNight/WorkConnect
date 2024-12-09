import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import CreateUser from './CreateUser';
import LogoutPage from './LogoutPage';
import RecoveryPage from './RecoveryPage';
import ProfilePage from './ProfilePage';
import CreateCompany from './CreateCompany';
import UserRecoveryPage from './UserRecoveryPage';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            
            {/* Use PrivateRoute to protect the routes */}
            <Route
              path="/home/:userID"
              element={<PrivateRoute element={<HomePage />} />}
            />
            <Route path="/register/user" element={<CreateUser />} />
            <Route path="/register/company" element={<CreateCompany />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/forgot/password" element={<RecoveryPage />} />
            <Route path="/forgot/username" element={<UserRecoveryPage />} />
            <Route
              path="/profile/:userID"
              element={<PrivateRoute element={<ProfilePage />} />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
