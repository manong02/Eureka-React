import React, { useState } from "react";
import './AddTaskOverlay.css';

const AddTaskOverlay = ({ isOpen, onClose, onTaskCreated }) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
  
      const taskData = { title, description, subjectId, dueDate };
  
      fetch("http://localhost:8000/backend/create_task.php", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
      })
      .then(response => response.json()) // assuming the response is JSON
      .then(data => {
          if (data.success) {
              console.log('Task created successfully');
              onTaskCreated(); //notify homeworkpage to reload tasks
              onClose(); // Close the overlay after successful task creation
              // Optionally, you can trigger a function to reload tasks here
          } else {
              console.error('Failed to create task:', data.message);
          }
      })
      .catch(error => console.error('Error:', error));
  };

    if(!isOpen) return null; //do not render overlay if not open

    return(
        <div className={`overlay ${isOpen ? "visible" : ""}`}> {/* Dynamically toggle the visible class */}
            <div className="overlay-content">
                <header>
                    <h1>New <span>Task</span></h1>
                    <button className="close_button" onClick={onClose}>
                    <i className='bx bx-x'></i>
                    </button>
                </header>
                <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

          <label htmlFor="subject_id">Subject</label>
          <select
            name="subject_id"
            id="subject_id"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            required
          >
            <option value="" disabled>Select a Subject</option>
            <option value="1">Mathematics</option>
            <option value="2">Geography</option>
            <option value="3">History</option>
            <option value="4">Literature</option>
            <option value="5">Science</option>
            <option value="6">English</option>
            <option value="7">French</option>
          </select>

          <label htmlFor="due_date">Due Date</label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <button type="submit" className="add_task_button">Add Task</button>
        </form>
            </div>
        </div>
    );
};

export default AddTaskOverlay