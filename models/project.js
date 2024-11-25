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

class Project extends Activity {
    constructor(newProjectName, newDeadline) {
        super(newProjectName, newDeadline);
        this.derivedTaskIDs = [];
    }

    // Setter for derived task IDs
    setSubactivities(newTaskIDs) {
        this.derivedTaskIDs = Array.isArray(newTaskIDs) ? newTaskIDs : [];
    }

    // Getter for derived task IDs
    getDerivedTasks() {
        return this.derivedTaskIDs;
    }
}

// Example usage:

// Create a project with a name and deadline
const myProject = new Project("My New Project", "2024-12-31");

// Set some derived tasks
myProject.setSubactivities([1, 2, 3, 4]);

// Get the derived tasks
console.log(myProject.getDerivedTasks()); // [1, 2, 3, 4]
