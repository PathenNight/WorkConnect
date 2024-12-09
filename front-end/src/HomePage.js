import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './styles.css';

const HomePage = () => {
    const { userID } = useParams();
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(null);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskList, setTaskList] = useState({});
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [showAddTaskPopup, setShowAddTaskPopup] = useState(false);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

    const fetchTasks = async () => {
        try {
            const response = await fetch(`http://localhost:8080/get/tasks/${userID}`);
            const data = await response.json();

            if (response.ok) {
                const tasksByDate = data.tasks.reduce((acc, task) => {
                    const taskDate = new Date(task.taskdate);
                    const taskDay = taskDate.getDate();
                    const taskMonth = taskDate.getMonth();
                    const taskYear = taskDate.getFullYear();

                    if (taskMonth === currentMonth && taskYear === currentYear) {
                        if (!acc[taskDay]) {
                            acc[taskDay] = [];
                        }
                        acc[taskDay].push({
                            taskName: task.name,
                            taskDescription: task.description,
                            userId: task.userId,
                        });
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

    const handleAddTask = async () => {
        if (taskName.trim() && selectedDate) {
            try {
                const formattedDate = new Date(currentYear, currentMonth, selectedDate)
                    .toISOString()
                    .split('T')[0];

                const response = await fetch('http://localhost:8080/create/task', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: userID,
                        taskName: taskName,
                        taskDescription: taskDescription,
                        taskdate: formattedDate,
                    }),
                });

                if (response.ok) {
                    setTaskName('');
                    setTaskDescription('');
                    setShowAddTaskPopup(false);
                    fetchTasks();
                } else {
                    console.error('Error adding task:', await response.json());
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const generateCalendar = () => {
        const calendar = [];
        let dayCount = 1;

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendar.push(null);
        }

        while (dayCount <= daysInMonth) {
            calendar.push(dayCount++);
        }

        return calendar;
    };

    const changeMonth = (direction) => {
        setCurrentMonth((prev) => {
            let newMonth = prev + direction;
            let newYear = currentYear;

            if (newMonth < 0) {
                newMonth = 11;
                newYear -= 1;
            } else if (newMonth > 11) {
                newMonth = 0;
                newYear += 1;
            }

            setCurrentYear(newYear); // Update the year
            return newMonth;
        });
    };

    useEffect(() => {
        fetchTasks();
    }, [currentMonth, currentYear]);

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="homepage-container">
            <nav className="navbar">
                <div className="navbar-links">
                    <button onClick={() => navigate(`/profile/${userID}`)}>Profile</button>
                    <button onClick={() => navigate(`/messages/${userID}`)}>Messages</button>
                    <button className="logout-button" onClick={() => navigate('/logout')}>Logout</button>
                </div>
            </nav>

            <div className="calendar-container">
                <div className="calendar-header">
                    <button className="nav-button" onClick={() => changeMonth(-1)}>
                        {"<"}
                    </button>
                    <span className="month-year">
                        {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
                    </span>
                    <button className="nav-button" onClick={() => changeMonth(1)}>
                        {">"}
                    </button>
                </div>

                <div className="calendar-grid">
                    {generateCalendar().map((day, index) => {
                        if (!day) {
                            return <div key={index} className="calendar-day"></div>;
                        }

                        const hasTasks = taskList[day] && taskList[day].length > 0;

                        return (
                            <div
                                key={index}
                                className={`calendar-day ${day === selectedDate ? 'selected' : ''}`}
                                onClick={() => setSelectedDate(day)}
                                style={{ backgroundColor: hasTasks ? '#4CAF50' : '' }}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedDate && (
                <div className="task-list-container">
                    <h3>Tasks for {selectedDate}</h3>
                    <button className="add-task-button" onClick={() => setShowAddTaskPopup(true)}>Add Task</button>
                    {taskList[selectedDate]?.length > 0 ? (
                        taskList[selectedDate].map((task, index) => (
                            <div key={index} className="task-item">
                                <p><strong>Task Name:</strong> {task.taskName}</p>
                                <p><strong>Description:</strong> {task.taskDescription}</p>
                            </div>
                        ))
                    ) : (
                        <p>No tasks for this date.</p>
                    )}
                </div>
            )}

            {showAddTaskPopup && (
                <div className="add-task-popup">
                    <div className="popup-card">
                        <button className="close-button" onClick={() => setShowAddTaskPopup(false)}>X</button>
                        <h3>Add New Task</h3>
                        <input
                            type="text"
                            placeholder="Task Name"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                        />
                        <textarea
                            placeholder="Task Description"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                        />
                        <button className="submit-button" onClick={handleAddTask}>Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomePage;
