
import java.time.*;

/**Task class which can have child tasks and data, such as
* the task's name, the project, the task ID, and names and
* IDs of the employees who work on the task associated with it
*/
public class Task extends Activity {
    private int baseProjectID;

    public Task() {
        this.setName("Unnamed Task");
    }

    public Task(String newTaskName) {
        super(newTaskName);
    }

    public Task(String newProjectName, LocalDate newDeadline) {
        super(newProjectName, newDeadline);
    }

    

    //Getters and setters

    /**
     * @param newBaseProjectID The ID of the project the task belongs to
     */
    public void setactivityProject(int newBaseProjectID) {
        this.baseProjectID = newBaseProjectID;
    }

    /**
     * @return baseProjectID The ID of the project the task belongs to
     */
    public int getBaseProject() {
        return this.baseProjectID;
    }
}