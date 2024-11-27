// Assuming Activity is another class that exists in your project
class Activity {
    constructor(name, deadline) {
        this.name = name || "Unnamed Activity";
        this.deadline = deadline || new Date(); // Default to the current date
    }

    // Getter and setter for the name
    getName() {
        return this.name;
    }

    setName(newName) {
        this.name = newName;
    }

    // Getter and setter for the deadline
    getDeadline() {
        return this.deadline;
    }

    setDeadline(newDeadline) {
        this.deadline = new Date(newDeadline); // Convert to Date object
    }
}

class Task extends Activity {
    constructor(newTaskName, newDeadline) {
        super(newTaskName, newDeadline);
        this.baseProjectID = null;  // Default value for project ID
    }

    // Setter for the project ID
    setActivityProject(newBaseProjectID) {
        this.baseProjectID = newBaseProjectID;
    }

    // Getter for the project ID
    getBaseProject() {
        return this.baseProjectID;
    }
}

// Example usage:

// Create a task with a name and deadline
const myTask = new Task("Complete Feature X", "2024-12-15");

// Set the project ID for the task
myTask.setActivityProject(101);

// Get the project ID for the task
console.log(myTask.getBaseProject());  // 101
