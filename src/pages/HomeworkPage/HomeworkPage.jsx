import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header.jsx';
import AddTaskButton from '../../components/AddTaskButton/AddTaskButton.jsx';
import AddTaskOverlay from '../../components/AddTaskOverlay/AddTaskOverlay';
import './HomeworkPage.css'

const HomeworkPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [flippedTasks, setFlippedTasks] = useState({});

  // Function to fetch task from the backend
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost/backend/get_tasks.php", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",  // Make sure to include cookies/session info
        });
  
        if (response.ok) {
          const data = await response.json();
          // console.log(data); // Debug: Check the data here
          setTasks(data); // Update state with the fetched tasks
          setLoading(false);
        } else {
          console.log("Failed to fetch tasks:", response.status);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
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

  
    const handleTaskCreated = () => {
      fetchTasks(); // Reload tasks after task creation
  };

  // fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  

  // Open and close the task overlay
  const openOverlay = () => setIsOverlayOpen(true);
  const closeOverlay = () => setIsOverlayOpen(false);

  // toggle flip state
  const handleFlip = (taskId) => {
    setFlippedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId], //toggle flipped state for the task
    }));
  };

  return (
    <div className="container">
      {/* Pass dynamic title */}
      <Header title="Homework Tasks" onOpenOverlay={openOverlay} />

      {/* The add task overlay */}
      <AddTaskOverlay isOpen={isOverlayOpen} 
                      onClose={closeOverlay} 
                      onTaskCreated={handleTaskCreated} />

      {/* Loading state */}
      {loading ? (
        <p>Loading tasks...</p>  // Display loading message
      ) : (

        <section className="tasks_container">
          {tasks.length === 0 ? (
            <p>No tasks available</p>  // Show message if no tasks
          ) : (

            tasks.map((task, index) => {
              // console.log(task);
              const topicImages = {
                mathematics: "/src/assets/features/homework/maths.png",
                literature: "/src/assets/features/homework/literature.png",
                history: "/src/assets/features/homework/geography.png",
                geography: "/src/assets/features/homework/geography.png",
                english: "/src/assets/features/homework/english.png",
                default: "/src/assets/features/homework/default.png",
              };

              const topicImage = 
                topicImages[task.subject_name.toLowerCase()] || topicImages.default;

              
                const isFlipped = !!flippedTasks[task.task_id];

              return (
                <div
                  className="task_item"
                  key={index}  
                  onClick={() => handleFlip(task.task_id)}
                >
                  <div 
                  className={`task_item_inner ${isFlipped ? "flipped" : ""}`}>

                    {/* front side */}
                    <div className='task_item_side front'>
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
                      {/* <i className={`bx bx-circle ${task.status === "completed" ? "checked" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation(); //prevent flipping the card when clicking the icon
                        handleStatusChange(task.task_id, task.status);
                      }}
                      ></i> */}
                  </div>
                    </div>

                   {/* Back Side */}
                   <div className="task_item_side back">
                      <p>
                        Description: <span className="description">{task.description}</span>
                      </p>
                      <p>
                        Status: <span className="status">{task.status}</span>
                      </p>
                    </div>
                 
                    
                  </div>
                </div>
              );
            })
          )}
        </section>
      )}
    </div>
  );
};

export default HomeworkPage;