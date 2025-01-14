import React from "react";
import { Link } from 'react-router-dom';
import './Tabbar.css';



function Tabbar(){

    return(
        <nav className="tabbar_container">
            <Link to='#'>
            <img src="/src/assets/logos/homeworklogo.png" alt="a book" />
            </Link>
            <Link to='#'>
            <img src="/src/assets/logos/studylogo.png" alt="someone studying" />
            </Link>
            <div className="home">
                <Link to="#">
                <img src="/src/assets/logos/homelogo.png" alt="a house" />
                </Link>
            </div>
            <Link to="#">
            <img src="/src/assets/logos/progresslogo.png" alt="a graph" />
            </Link>
            <Link to="#">
            <img src="/src/assets/logos/collablogo.png" alt="a handshake" />
            </Link>

        </nav>
    );
};

export default Tabbar