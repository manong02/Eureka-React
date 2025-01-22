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
  
      fetch("http://localhost/backend/create_task.php", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
          credentials: "include", // Important to send cookies (session data)
      })
      .then(response => response.text()) // Read the response as text first
      .then(text => {
          try {
              const data = JSON.parse(text); // Try parsing the text as JSON
              if (data.success) {
                  console.log('Task created successfully:', data.message);
                  onTaskCreated(); // Trigger the callback to refresh tasks
                  onClose(); // Close the overlay
              } else {
                  console.error('Failed to create task:', data.message);
                  alert('Failed to create task: ' + data.message); // Optional error alert
              }
          } catch (error) {
              console.error('Error parsing JSON:', error, 'Response Text:', text);
              alert('Something went wrong. Please try again.');
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Something went wrong!'); // Fallback for any network or fetch issues
      });
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