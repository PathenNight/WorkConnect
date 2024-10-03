import java.time.*;
import java.util.*;

/**Project class that accesses data related to the
 * project, like its ID, name, employees, deadline,
 * and tasks.
 */
public class Project extends Activity {
    private List<Integer> derivedTaskIDs;

    //Constructors

    public Project() {
        this.setName("Unnamed Project");
    }

    public Project(String newProjectName) {
        this.setName(newProjectName);
    }

    public Project(String newProjectName, LocalDate newDeadline) {
        super(newProjectName, newDeadline);
    }

    //Getters and setters

    /**
     * @param newTaskIDs An ordered list of the tasks that are derived
     * from this project
     */
    public void setSubactivitys(List<Integer> newTaskIDs) {
        this.derivedTaskIDs = newTaskIDs;
    }

    /**
     * @return derivedTaskIDs The ordered list of tasks deriving from this project
     */
    public List<Integer> getDerivedTasks() {
        return this.derivedTaskIDs;
    }
}