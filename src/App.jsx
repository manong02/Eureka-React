import React, {useState} from "react"
import { BrowserRouter as Router, Route, Routes, Outlet, useLocation, Navigate } from 'react-router-dom';
import Tabbar from "./components/Tabbar/Tabbar.jsx"
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Login from "./pages/LoginIn/LoginIn.jsx";
import SignUp from "./pages/SignUp/SignUp.jsx";
import HomeworkPage from "./pages/HomeworkPage/HomeworkPage.jsx";
import './styles/styles.css';

function App() {

  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); //track login state

  const openOverlay = () => setIsOverlayOpen(true);
  const closeOverlay = () => setIsOverlayOpen(false);

  return (
    <Router>
    <Routes>
      {/* Routes for Login and SignUp pages (no Tabbar here) */}
      <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Routes with Tabbar */}
      <Route path="/" element={<Layout />}>
        {/* Protected route: if not logged in, redirect to login */}
        <Route 
          index 
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} 
        />
        <Route
          path="homeworkpage"
          element={
            <HomeworkPage 
              openOverlay={openOverlay} 
              isOverlayOpen={isOverlayOpen} 
              closeOverlay={closeOverlay} 
            />
          }
        />
      </Route>
    </Routes>
  </Router>
  );
}

// Layout component for rendering the Tabbar and Outlet for child routes
function Layout() {
  const location = useLocation();
  console.log(location.pathname);

  return (
    <>
      {location.pathname !== "/login" && location.pathname !== "/signup" && <Tabbar />}
      {/* Outlet renders child routes */}
      <div className="layout-content">
        <Outlet />
      </div>
    </>
  );
}

export default App
