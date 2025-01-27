import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header.jsx";
import AddTaskOverlay from "../../components/AddTaskOverlay/AddTaskOverlay.jsx";
import './Dashboard.css'



function Dashboard(){
    const [tasks, setTasks] = useState([]);
    const [nextTask, setNextTask] = useState(null); //to hold next due task
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [flippedTasks, setFlippedTasks] = useState({});
    

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost/backend/get_tasks.php", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Ensure cookies/session info are included
        });
    
        if (response.ok) {
          const data = await response.json();
    
          // Sort tasks by due date, with a tie-breaker (task title)
          const sortedTasks = data.sort((a, b) => {
            const dateA = new Date(a.dueDate);
            const dateB = new Date(b.dueDate);
    
            console.log(`Comparing: ${dateA} and ${dateB}`);
            if (dateA - dateB !== 0) {
              return dateA - dateB; // Sort by due date
            }
    
            // Tie-breaker: Alphabetical by title
            console.log(`Tie-breaker: Comparing ${a.title} and ${b.title}`);
            return a.title.localeCompare(b.title);
          });
    
          setTasks(sortedTasks);
    
          // Set the next task (earliest due date)
          setNextTask(sortedTasks[0]);
          setLoading(false);
        } else {
          console.error("Failed to fetch tasks:", response.status);
          setLoading(false);
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
     
     
       // toggle flip state
       const handleFlip = (taskId) => {
         setFlippedTasks((prev) => ({
           ...prev,
           [taskId]: !prev[taskId], //toggle flipped state for the task
         }));
       };

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
    
      const topicImage =
        nextTask && nextTask.subject_name
          ? topicImages[nextTask.subject_name.toLowerCase()] || topicImages.default
          : topicImages.default;

    return(
        <div className="container">
            {/* Pass dynamic title */}
            <Header title="Welcome" onOpenOverlay={() => setIsOverlayOpen(true)} />

            {/* The add task overlay */}
          <AddTaskOverlay isOpen={isOverlayOpen} 
                      onClose={() => setIsOverlayOpen(false)} 
                      onTaskCreated={handleTaskCreated} />

            
            {loading ? (
              <p>Loading tasks...</p> //loading message
            ) : (
              
              <>
              {/* display next due task */}
              {nextTask ? (
                <section className="next_due_container">
                
                <div className="logo">
                    <img src={topicImage} alt={nextTask.subject_name || "Default"} />
                </div>

                <div className="next_due_task">
                    <h4>Next Due:</h4>
                      <p className="next_due_dashboard">{nextTask.title}</p>
                      <p className="next_due_dashboard_date">{nextTask.dueDate}</p>

                      <div className="next_due_check">
                      {/* animation container */}
                      <label className="animation_container">
                          <input
                            type="checkbox"
                            checked={nextTask.status === "completed"}
                            onChange={(e) => { 
                              e.stopPropagation(); //prevent flipping the card when clicking the icon
                              handleStatusChange(nextTask.task_id, nextTask.status);
                            }}
                          />
                          <span className="label"></span>
                          <span className="checkbox"></span>
                          <span className="checkmark"></span>
                      </label>
                  </div>
                    
                </div>
                

            </section>
              ) : (
                <p>No tasks available</p> //message if not tasks
              )}
              </>
            )}
            
            
            
            {/* utilities section */}
            <section className="utilities_container">
                <div className="calendar_timer">
                    <div className="utility_item">
                        <a href="#">
                            <img src="/src/assets/features/dashboard/calendar.png" alt="calendar" />
                        </a>
                        <p>Calendar</p>
                    </div>
                    <div className="utility_item">
                    <a href="#">
                    <img src="/src/assets/features/dashboard/stopwatch.png" alt="stopwatch" />
                    </a>
                    <p>Timer</p>
                    </div>
                </div>
                <div className="calculator">
                    <div className="utility_item">
                        <a href="#">
                            <img src="/src/assets/features/dashboard/calculator.png" alt="calculator" />
                        </a>
                        <p>Calculator</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Dashboard