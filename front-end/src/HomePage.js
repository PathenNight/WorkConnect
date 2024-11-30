import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './styles.css';

const HomePage = () => {
    const { userID } = useParams();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(null);
    const [taskInput, setTaskInput] = useState('');
    const [taskList, setTaskList] = useState({});
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const generateCalendar = () => {
        let calendar = [];
        let dayCount = 1;

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendar.push(null);
        }

        for (let i = firstDayOfMonth; i < 7; i++) {
            calendar.push(dayCount++);
        }

        while (dayCount <= daysInMonth) {
            for (let i = 0; i < 7; i++) {
                if (dayCount <= daysInMonth) {
                    calendar.push(dayCount++);
                }
            }
        }

        return calendar;
    };

    const handleDateClick = (day) => {
        setSelectedDate(day);
    };

    const handleAddTask = async () => {
        if (taskInput.trim() && selectedDate) {
            try {

                const formattedDate = new Date(currentYear, currentMonth, selectedDate)
                .toISOString()
                .split('T')[0];

                const response = await fetch('http://localhost:8080/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userID,
                        taskName: taskInput,
                        taskDate: formattedDate,
                    }),
                });
    
                const data = await response.json();
                if (response.ok) {
                    setTaskInput('');
                    fetchTasks();
                } else {
                    console.error('Error adding task:', data);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    
    const fetchTasks = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/${userID}`);
            const data = await response.json();
            if (response.ok) {
                // Organize tasks by date
                const tasksByDate = data.tasks.reduce((acc, task) => {
                    const taskDate = new Date(task.taskDate);
                    const taskDay = taskDate.getDate();
                    const taskMonth = taskDate.getMonth();
                    const taskYear = taskDate.getFullYear();
                    
                    if (taskMonth === currentMonth && taskYear === currentYear) {
                        if (!acc[taskDay]) {
                            acc[taskDay] = [];
                        }
                        acc[taskDay].push(task.taskDescription);
                    }
                    return acc;
                }, {});

                setTaskList(tasksByDate);
            } else {
                console.error('Error fetching tasks:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handlePreviousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('userID');
        navigate('/logout');
    };

    useEffect(() => {
        setTaskInput('');
        setSelectedDate(null);
        fetchTasks();
    }, [currentMonth, currentYear]);

    return (
        <div className="homepage-container">
            <nav className="navbar">
                <div className="navbar-links">
                    <a href="#profile">Profile</a>
                    <a href="#messages">Messages</a>
                    <a href="#notifications">Notifications</a>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            <div className="calendar-container">
                <div className="calendar-header">
                    <button className="nav-button" onClick={handlePreviousMonth}>{"<"}</button>
                    <span className="month-year">{`${new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} ${currentYear}`}</span>
                    <button className="nav-button" onClick={handleNextMonth}>{">"}</button>
                </div>

                <div className="days-of-week">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                        <div key={index} className="calendar-day header-day">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="calendar-grid">
                {generateCalendar().map((day, index) => {
                        if (day) {
                            const taskCount = taskList[day] ? taskList[day].length : 0;
                            const hasTasks = taskList[day] && taskList[day].length > 0;
                            const isSelected = day === selectedDate;

                            return (
                                <div
                                    key={index}
                                    className={`calendar-day ${isSelected ? 'selected' : ''}`}
                                    onClick={() => handleDateClick(day)}
                                    style={{
                                        backgroundColor: hasTasks ? '#4CAF50' : '',
                                        color: isSelected ? 'white' : '',
                                        borderColor: isSelected ? '#1976D2' : ''  // Blue border for selected
                                    }}
                                >
                                    <div className="day-number">{day}</div>
                                    {taskCount > 0 && window.innerWidth >= 768 ? (
                                        <div className="task-count">{taskCount}</div>
                                    ) : null}
                                </div>
                            );
                        }
                        return <div key={index} className="calendar-day"></div>;
                    })}
                </div>

                {selectedDate && (
                    <div className="task-input-container">
                        <input
                            type="text"
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            placeholder="Add task"
                        />
                        <button onClick={handleAddTask}>Add Task</button>
                    </div>
                )}

                <div className="task-list">
                    {selectedDate && taskList[selectedDate] && taskList[selectedDate].map((task, idx) => (
                        <div key={idx} className="task-item">{task}</div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
