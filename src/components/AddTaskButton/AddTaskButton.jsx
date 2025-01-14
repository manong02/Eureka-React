import React from "react";
import './AddTaskButton.css';

const AddTaskButton = ({onClick }) => {

    return(
        <div className="add_button_wrapper">
        <button className="add_button" onClick={onClick}>
          <i className="bx bx-plus"></i>
        </button>
      </div>
    );
}

export default AddTaskButton