let selectedDateCell = null;

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