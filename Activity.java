import java.time.*;
import java.util.*;


/**Generic class for every object that could have a deadline,
 * employees assigned to it, and a name.
*/
public class Activity {

    //Constructors

    private int id; //Genereated with autoincrement in SQL
    private String name;
    private List<Integer> employeeIDs;
    private LocalDate deadline;

    //Constructors

    public Activity() {
        this.name = "Unnamed Activity";
        //Call Javascript/SQL to generate an ID
    }

    public Activity(String newName) {
        this.name = newName;
        //Call Javascript/SQL to generate an ID
    }

    public Activity(String newName, LocalDate newDeadline) {
        this.name = newName;
        this.deadline = newDeadline;
        //Call Javascript/SQL to generate an ID
    }


    //Everything below are getter/setter methods
    /**
     * @param newName The new name of the activity
     */
    public void setName(String newName) {
        this.name = newName;
    }

    /**
     * @return activityName The name of the activity
     */
    public String getName() {
        return this.name;
    }

    /**
     * @param activityID The new ID for the activity
     */
    public void setactivityID(int newID) {
        /*Because IDs are generated in SQL, this is just for the java object.
        Other methods may actually write to SQL, but this will not.*/
        this.id = newID;
    }

    /**
     * @return activityID The ID for the activity
     */
    public int getactivityID() {
        return this.id;
    }
    /**
     * @param activityDeadline The deadline for the activity
     */
    public void setactivityDeadline(LocalDate newDeadline) {
        this.deadline = newDeadline;
    }

    /**
     * @return deadline The deadline for the activity
     */
    public LocalDate getDeadline() {
        return this.deadline;
    }
    
    /**
     * @param newEmployeeIDs The IDs of the activity's employees
     */
    public void setAssociatedEmployee(List<Integer> newEmployeeIDs) {
        this.employeeIDs = newEmployeeIDs;
    }

    /**
     * @return employeeIDs An ordered list of the activity's assigned employees
     */
    public List<Integer> getAssociatedEmployees() {
        return this.employeeIDs;
    }
}