import React from "react"
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Tabbar from "./components/Tabbar/Tabbar.jsx"
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Login from "./pages/LoginIn/LoginIn.jsx";
import SignUp from "./pages/SignUp/SignUp.jsx";
import './styles/styles.css';

function App() {


  return (
    <>
     <Router>
      <Routes>
             {/* Set Dashboard as the default route */}
        <Route path="/" element={<Layout />} />

          {/* route for login page */}
          <Route path="/login" element={<Login />} />

          {/* Route for the signup page */}
          <Route path="/signup" element={<SignUp />} />
      </Routes>
     </Router>
    </>
  )
}

function Layout() {
  const location = useLocation();

  return (
    <>
      {/* Conditionally render Tabbar only for non-login/signup routes */}
      {location.pathname !== "/login" && location.pathname !== "/signup" && <Tabbar />}
      
      <Routes>
        {/* Set Dashboard as the default route */}
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </>
  );
}


export default App
