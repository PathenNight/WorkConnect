
/**Creates a task object. Assuming for the moment that tasks
 * and projects are different.
 * 
 */
public class Task {
    private String taskName;
    private String taskID; //Task ID could be key in SQL code
    private String deadline;
    private String employeeIDs[];
    private String employeeNames[]; 
    //Maybe employeeName is stored elsewhere but for now this is fine


    /**Solely for testing purposes. May delete when we have
     * an actual main folder
     */
    public static void main(String args[]) {
        Task createPlan = new Task("Create Plan");
        System.out.println(createPlan.getTaskName());

        Task completeTeamReview = new Task();
        completeTeamReview.setTaskName("Complete Team Review");
        System.out.println(completeTeamReview.getTaskName());
    }

    public Task() {

    }
    
    public Task(String taskName) {
        this.setTaskName(taskName);
    }

    //Everything below this point is getters and setters.

    /**Setter for taskName
     * @param newTaskName The name the task needs to be given
     */
    public void setTaskName(String newTaskName) {
        this.taskName = newTaskName;
    }

    /**Returns the task's name
     * @return taskName The name of the task
     */
    public String getTaskName() {
        return this.taskName;
    }
}