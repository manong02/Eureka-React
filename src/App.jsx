import React, {useState} from "react"
import { BrowserRouter as Router, Route, Routes, Outlet, useLocation } from 'react-router-dom';
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

        {/* Route for layout with tabbar */}
        <Route path="/" element={<Layout />}>

        {/* protected route: if not logged in, redirect to login */}

        {/* Default route is Login */}
        <Route index 
        element={isLoggedIn ? <Dashboard/> : <Login setIsLoggedIn={setIsLoggedIn} />} />
        
          {/* Homework page route */}
          <Route
            path="homeworkpage"
            element={<HomeworkPage openOverlay={openOverlay} isOverlayOpen={isOverlayOpen} closeOverlay={closeOverlay} />}
          />

          {/* end of layout with tabbar */}
        </Route>

        {/* Routes for Login and SignUp pages */}
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<SignUp />} />
        
      </Routes>
    </Router>
  );
}

// Layout component for rendering the Tabbar and Outlet for child routes
function Layout() {
  const location = useLocation();

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
