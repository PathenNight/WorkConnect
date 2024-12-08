import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import HomePage from './HomePage';
import CreateUser from './CreateUser';
import LogoutPage from './LogoutPage';
import RecoveryPage from './RecoveryPage';
import ProfilePage from "./ProfilePage";
import CreateCompany from './CreateCompany';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />}></Route>
          <Route path="/home/:userID" element={<HomePage />}></Route>
          <Route path="/register/user" element={<CreateUser />}></Route>
          <Route path="/register/company" element={<CreateCompany />}></Route>
          <Route path="/logout" element={<LogoutPage />}></Route>
          <Route path="/forgot" element={<RecoveryPage />}></Route>
          <Route path="/profile/:userID" element={<ProfilePage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
