
let selectedDateCell = null;
const API_URL = 'https://localhost:5000/auth/login'; // Update to your backend URL if different.


// get the modal
var modal = document.getElementById('id01');

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

async function login() {
    const username = document.getElementById('uname').value;
    const password = document.getElementById('psw').value;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Login successful!');
            console.log(result); // Handle tokens or redirection here
        } else {
            alert(`Login failed: ${result.message}`);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again later.');
    }
}

function selectDate(cell) {
    // Remove the 'selected' class from previously selected cell
    if (selectedDateCell) {
        selectedDateCell.classList.remove('selected');
    }
    // Add the 'selected' class to the clicked cell
    selectedDateCell = cell;
    selectedDateCell.classList.add('selected');

    // Show the task input
    const taskInputContainer = document.getElementById('taskInputContainer');
    taskInputContainer.style.display = 'flex';
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    if (taskInput.value.trim() !== '' && selectedDateCell) {
        const taskItem = document.createElement('div');
        taskItem.textContent = `${taskInput.value}`;
        selectedDateCell.appendChild(taskItem);
        taskInput.value = ''; // Clear the input
    } else if (!selectedDateCell) {
        alert('Please select a date first.');
    } else {
        alert('Please enter a task.');
    }
}
