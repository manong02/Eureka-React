import React from 'react';
import './Header.css';
import AddTaskButton from '../AddTaskButton/AddTaskButton.jsx';

const Header = ({ title, onOpenOverlay }) => {
  return (
    <>
    <header>
      <div className="welcome-message">
        <h1 id="welcome_user">{title}</h1>
      </div>
      <div className="add_button_wrapper">
        <AddTaskButton onClick={onOpenOverlay}/>
      </div>
    </header>
  </>);
}

export default Header;
