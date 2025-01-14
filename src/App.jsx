import React from "react"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Tabbar from "./components/Tabbar/Tabbar.jsx"
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import './styles/styles.css';

function App() {

  return (
    <>
     <Router>
      <Routes>
             {/* Set Dashboard as the default route */}
          <Route path="/" element={<Dashboard />} />
      </Routes>
      <Tabbar/>
     </Router>
    </>
  )
}

export default App
