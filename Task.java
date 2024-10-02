
import java.util.*;


/**Task object which can have child tasks and data, such as
* the task's name, the project, the task ID, and names and
* IDs of the employees who work on the task associated with it
*/
public class Task {
    private String taskName;

    /*IDs could be keys in SQL code; most IDs might also just be backend.
    Depending on how we want to do this, the IDs could just be a way for
    the server to keep track. We definitely should have them so we can
    have multiple tasks for projects that are named similarly. Multiple
    projects could have "Write plan" tasks, for example.*/
    private int taskID;
    private Date deadline;
    private int projectID;
    /*Was going to include names for employees, projects, etc.
    but we can likely just pull these things from SQL if
    we have the keys? Don't want any redundancies.*/
    private List<Integer> employeeIDs;
    private List<Integer> subTaskIDs;


    /**Solely for testing purposes. May delete when we have
    * an actual main folder*/
    public static void main(String args[]) {
    }

    //Constructors
    //Assuming for now everything must have taskID + projectID
    /*TODO: Find a way to generate the task IDs? Likely use the same
    idea for generating other IDs like employeeID or projectID.*/

    public Task() {
        this.taskName = "Unnamed task";
        //Generate some task ID here and assign it to this.taskID
    }
    
    /**
     * @param projectID The ID of the project the task belongs to
     */
    public Task(int projectID) {
        this.taskName ="Unnamed task";
        this.projectID = projectID;
        //Generate some taskID here
    }

    /**
     * @param taskName The name of the task
     * @param projectID The ID of the project the task belongs to
     */
    public Task(int taskID, int projectID) {
        this.taskID = taskID;
        this.projectID = projectID;
        this.taskName = "Unnamed task";
    }

    /**
     * @param taskName The name of the task
     * @param taskID The new ID for the task
     * @param projectID The ID of the project the task belongs to
     */
    public Task(String taskName, int taskID, int projectID) {
        this.taskName = taskName;
        this.taskID = taskID;
        this.projectID = projectID;
    }

    /**
     * @param taskName The name of the task
     * @param taskID The new ID for the task
     * @param projectID The ID of the project the task belongs to
     * @param deadline The date the task should be completed
     */
    public Task(String taskName, int taskID, int projectID, Date deadline) {
        this.taskID = taskID;
        this.taskName = taskName;
        this.projectID = projectID;
        this.deadline = deadline;
    }

    
    /**
     * @param taskName The name of the task
     * @param taskID The new ID for the task
     * @param projectID The ID of the project the task belongs to
     * @param deadline The date the task should be completed
     * @param assignedEmployeeIDs The IDs of the employees who have
     * been assigned to this task
     */
    public Task(String taskName, int taskID, int projectID, Date deadline,
        List<Integer> assignedEmployeesIDs) {
        
            this.taskName = taskName;
            this.taskID = taskID;
            this.projectID = projectID;
            this.deadline = deadline;
            this.employeeIDs = assignedEmployeesIDs;
    }


    //Everything below this point is getters and setters.

    /**
     * @param newTaskName The new name of the task
     */
    public void setTaskName(String newTaskName) {
        this.taskName = newTaskName;
    }

    /**
     * @return taskName The name of the task
     */
    public String getTaskName() {
        return this.taskName;
    }

    /**
     * @param taskID The new ID for the task
     */
    public void setTaskID(int taskID) {
        this.taskID = taskID;
    }

    /**
     * @return taskID The ID for the task
     */
    public int getTaskID() {
        return this.taskID;
    }
    /**
     * @param taskDeadline The deadline for the task
     */
    public void setTaskDeadline(Date taskDeadline) {
        this.deadline = taskDeadline;
    }

    /**
     * @return deadline The deadline for the task
     */
    public Date getTaskDeadline() {
        return this.deadline;
    }
    
    /**
     * @param newEmployeeIDs The IDs of the task's employees
     */
    public void setAssociatedEmployee(List<Integer> newEmployeeIDs) {
        this.employeeIDs = newEmployeeIDs;
    }

    /**
     * @return employeeIDs An ordered list of the task's assigned employees
     */
    public List<Integer> getAssociatedEmployees() {
        return this.employeeIDs;
    }

    /**
     * @param newSubTaskIDs An ordered list of the tasks that are derived
     * from this task
     */
    public void setSubTasks(List<Integer> newSubTaskIDs) {
        this.subTaskIDs = newSubTaskIDs;
    }

    /**
     * @return subTaskIDs The ordered list of tasks deriving from this task
     */
    public List<Integer> getSubTasks() {
        return this.subTaskIDs;
    }

    /**
     * @param newProjectID The ID of the project the task belongs to
     */
    public void setTaskProject(int newProjectID) {
        this.projectID = newProjectID;
    }

    /**
     * @return projectID The ID of the project the task belongs to
     */
    public int getTaskProject() {
        return this.projectID;
    }
}