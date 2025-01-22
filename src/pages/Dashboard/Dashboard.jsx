import React, { useState } from "react";
import Header from "../../components/Header/Header.jsx";
import AddTaskOverlay from "../../components/AddTaskOverlay/AddTaskOverlay.jsx";
import './Dashboard.css'
import HomeworkPage from "../HomeworkPage/HomeworkPage.jsx";


function Dashboard(){
    
    const[isOverlayOpen, setIsOverlayOpen] = useState(false);

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