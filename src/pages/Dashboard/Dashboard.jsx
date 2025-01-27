import React, { useState } from "react";
import Header from "../../components/Header/Header.jsx";
import AddTaskOverlay from "../../components/AddTaskOverlay/AddTaskOverlay.jsx";
import './Dashboard.css'
import HomeworkPage from "../HomeworkPage/HomeworkPage.jsx";


function Dashboard(){
    
    const [tasks, setTasks] = useState([]);
    const[isOverlayOpen, setIsOverlayOpen] = useState(false);

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
        console.log('Task created successfully!'); 
        // Add any additional logic to refresh data or update the UI
    };

    const openOverlay = () => {
        setIsOverlayOpen(true);
    };

    const closeOverlay = () => {
        setIsOverlayOpen(false);
    };

    return(
        <div className="container">
            {/* Pass dynamic title */}
            <Header title="Welcome" onOpenOverlay={openOverlay}/>

            {/* The add task overlay */}
            <AddTaskOverlay isOpen={isOverlayOpen} 
                            onClose={closeOverlay}
                            onTaskCreated={handleTaskCreated}/>

            {/* Next due task section */}
            <section className="next_due_container">
                
                <div className="logo">
                    <img src="/src/assets/features/dashboard/nextdue.png" alt="a book" />
                </div>
                <div className="next_due_task">
                    <h4>Next Due:</h4>
                    <p className="next_due_dashboard">Maths exercises</p>
                    <p className="next_due_dashboard_date">16/02/2025</p>
                </div>
                <div className="next_due_check">
                    <i className="bx bx-circle"></i>
                </div>
            </section>
            
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