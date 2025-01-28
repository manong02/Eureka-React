import React, { useState, useEffect } from 'react';
import ReactCardFlip from 'react-card-flip';
import Header from '../../components/Header/Header.jsx';
import AddTaskButton from '../../components/AddTaskButton/AddTaskButton.jsx';
import AddTaskOverlay from '../../components/AddTaskOverlay/AddTaskOverlay';
import './HomeworkPage.css'

const HomeworkPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

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

  // function to format the status to be more user-friendly
  const formatStatus = (status) => {
    switch(status){
      case "pending":
        return "In Progress";
      case "completed":
        return "Finished";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);  // Capitalize as fallback
    }
  }

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

  function flipCard(taskId){
    setIsFlipped((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  }
  

  // Open and close the task overlay
  const openOverlay = () => setIsOverlayOpen(true);
  const closeOverlay = () => setIsOverlayOpen(false);

   return(
    <div className='container'>
      <Header title="Homework Tasks" onOpenOverlay={openOverlay}/>
      <AddTaskOverlay isOpen={isOverlayOpen}
                      onClose={closeOverlay}
                      onTaskCreated={handleTaskCreated}/>
      
      
       {/* Loading state */}
       {loading ? (
        <p>Loading tasks...</p> // Display loading message
      ) : (
        <div className="tasks_container">
          {tasks.length === 0 ? (
            <p>No tasks available</p> // Show message if no tasks
          ) : (
            tasks.map((task) => {
              const topicImages = {
                mathematics: "/src/assets/features/homework/maths.png",
                science: "/src/assets/features/homework/maths.png",
                literature: "/src/assets/features/homework/literature.png",
                history: "/src/assets/features/homework/geography.png",
                geography: "/src/assets/features/homework/geography.png",
                english: "/src/assets/features/homework/english.png",
                french: "/src/assets/features/homework/french.png",
                default: "/src/assets/features/homework/default.png",
              };

            const topicImage = topicImages[task.subject_name.toLowerCase()] || topicImages.default;

            return(
            <ReactCardFlip flipDirection="horizontal" isFlipped={isFlipped[task.task_id] || false}
            key={task.task_id}>
              {/* Front Side */}
              <div className="card" onClick={() => flipCard(task.task_id)}>
                <div className="logo">
                  <img src={topicImage} alt={task.subject_name} />
                </div>
                <div className="task">
                  <div className="topic">
                    <p>
                      Topic: <span className="topic">{task.subject_name}</span>
                    </p>
                  </div>
                  <div className="title">
                    <p>
                      Title: <span className="title">{task.title}</span>
                    </p>
                  </div>
                  <div className="due_date">
                    <p>
                      Due: <span className="current_due_date">{task.dueDate}</span>
                    </p>
                  </div>
                </div>
                <div className="next_due_check">
                  <label className="animation_container">
                    <input
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={(e) => {
                        e.stopPropagation(); // Prevent flipping the card when clicking checkbox
                        handleStatusChange(task.task_id, task.status);
                      }}
                    />
                    <span className="label"></span>
                    <span className="checkbox"></span>
                    <span className="checkmark"></span>
                  </label>
                </div>
              </div>

              {/* Back Side */}
              <div className="card-back" onClick={() => flipCard(task.task_id)}>
                <p>
                  Description: <span className="description">{task.description}</span>
                </p>
                <p>
                  Status: <span className="status">{task.status}</span>
                </p>
              </div>
            </ReactCardFlip>
        );
      })
    )}
      </div>
    )}
    </div>
   );

  };
  

export default HomeworkPage;