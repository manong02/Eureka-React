import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header.jsx';
import AddTaskButton from '../../components/AddTaskButton/AddTaskButton.jsx';
import AddTaskOverlay from '../../components/AddTaskOverlay/AddTaskOverlay';

const HomeworkPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8000/backend/get_tasks.php", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",  // Make sure to include cookies/session info
        });
  
        if (response.ok) {
          const data = await response.json();
          setTasks(data);  // This will set tasks to the fetched data
        } else {
          console.log("Failed to fetch tasks:", response.status);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
  
    const handleTaskCreated = () => {
      fetchTasks(); // Reload tasks after task creation
  };
  }, []);

  

  // Open and close the task overlay
  const openOverlay = () => setIsOverlayOpen(true);
  const closeOverlay = () => setIsOverlayOpen(false);

  return (
    <div className="container">
      {/* Pass dynamic title */}
      <Header title="Homework Tasks" onOpenOverlay={openOverlay} />

      {/* The add task overlay */}
      <AddTaskOverlay isOpen={isOverlayOpen} onClose={closeOverlay} onTaskCreated={handleTaskCreated} />

      {/* Tasks */}
      <section className="tasks_container">
        {tasks.length === 0 ? (
          <p>No tasks available</p> // Show message if no tasks
        ) : (
          tasks.map((task, index) => {
            const topicImages = {
              mathematics: "/src/assets/features/homework/maths.png",
              literature: "/src/assets/features/homework/literature.png",
              history: "/src/assets/features/homework/history.png",
              geography: "/src/assets/features/homework/geography.png",
              english: "/src/assets/features/homework/english.png",
              default: "/src/assets/features/homework/default.png",
            };

            const topicImage = topicImages[task.subject_name.toLowerCase()] || topicImages.default;

            return (
              <div
                className="task_item"
                key={index}
                onTouchStart={(e) => (touchStartX = e.changedTouches[0].screenX)}
                onTouchEnd={(e) => {
                  touchEndX = e.changedTouches[0].screenX;
                  if (touchEndX < touchStartX - 50) {
                    handleGesture(index);
                  }
                }}
              >
                <div className="logo">
                  <img src={topicImage} alt={task.subject_name} />
                </div>
                <div className="task">
                  <div className="topic">
                    <p>Topic: <span className="topic">{task.subject_name}</span></p>
                  </div>
                  <div className="due_date">
                    <p>Due: <span className="current_due_date">{task.dueDate}</span></p>
                  </div>
                </div>
                <div className="next_due_check">
                  <i className='bx bx-circle'></i>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};

export default HomeworkPage;
