import React, { useState } from 'react';

const TaskItem = ({ task, onFlip, isFlipped }) => {
  const topicImages = {
    mathematics: "/src/assets/features/homework/maths.png",
    literature: "/src/assets/features/homework/literature.png",
    history: "/src/assets/features/homework/geography.png",
    geography: "/src/assets/features/homework/geography.png",
    english: "/src/assets/features/homework/english.png",
    french: "/src/assets/features/homework/french.png",
    default: "/src/assets/features/homework/default.png",
  };

  const handleFlip = () => {
    onFlip(task.task_id);  // Pass taskId to the parent for managing flip state
  };

  const formatStatus = (status) => {
    switch(status){
      case "pending":
        return "In Progress";
      case "completed":
        return "Finished";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);  // Capitalize as fallback
    }
  };

   // Handle status change when "circle" icon is clicked
   const handleStatusChange = async (taskId, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";

    try {
      const response = await fetch("http://localhost/backend/update_task_status.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task_id: taskId, status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        // Update the task status in the state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.task_id === taskId ? { ...task, status: newStatus } : task
          )
        );
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const topicImage = topicImages[task.subject_name.toLowerCase()] || topicImages.default;

  return (
    <div className="task_item" onClick={handleFlip}>
      <div className={`task_item_inner ${isFlipped ? "flipped" : ""}`}>

        {/* Front Side */}
        <div className="task_item_side front">
          <div className="logo">
            <img src={topicImage} alt={task.subject_name} />
          </div>
          <div className="task">
            <div className="topic">
              <p>Topic: <span className="topic">{task.subject_name}</span></p>
            </div>
            <div className="title">
              <p>Title: <span className='title'>{task.title}</span></p>
            </div>
            <div className="due_date">
              <p>Due: <span className="current_due_date">{task.dueDate}</span></p>
            </div>
            <div className="next_due_check">
                      {/* animation container */}
                      <label className="animation_container">
                          <input
                            type="checkbox"
                            checked={task.status === "completed"}
                            onChange={(e) => { 
                              e.stopPropagation(); //prevent flipping the card when clicking the icon
                              handleStatusChange(task.task_id, task.status);
                            }}
                          />
                          <span className="label"></span>
                          <span className="checkbox"></span>
                          <span className="checkmark"></span>
                      </label>
                  </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="task_item_side back">
          <p>Description: <span className="description">{task.description}</span></p>
          <p>Status: <span className="status">{formatStatus(task.status)}</span></p>
        </div>

      </div>
    </div>
  );
};

export default TaskItem;
