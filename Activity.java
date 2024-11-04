package DevProject;
import java.time.*;
import java.util.*;

/**Generic class for every object that could have a deadline,
 * employees assigned to it, and a name.
 */
public class Activity {

	//Constructors
	//Assuming for now everything must have activityID + projectID
	/*TODO: Find a way to generate the activity IDs? Likely use the same
    idea for generating other IDs like employeeID or projectID.*/

	private static int idCounter = 1; // Counter for generating unique IDs
	
	private int id;
	private String name;
	private List<Integer> employeeIDs;
	private LocalDate deadLine;
	private LocalDate startDate;

	//Constructors

	public Activity(String name, LocalDate startDate, LocalDate deadLine) {
		this.id = idCounter++;
		setName(name);
		setActivityStart(startDate);
		setActivityDeadline(deadLine);
		this.employeeIDs = new ArrayList<>();
		//Generate an ID (?)
		
	}

	public Activity(String name) {
		this(name, null, null);
		//Generate an ID (?)
		
	}

	public Activity(String name, LocalDate deadLine) {
		this(name, null, deadLine);
		//Generate an ID (?)
		
	}


	//Everything below are getter/setter methods
	/**
	 * @param newName The new name of the activity
	 */
	public void setName(String newName) {
		this.name = (newName != null ? newName : this.name);
		
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
	public void setActivityID(int newID) {
		this.id = newID;
		
	}

	/**
	 * @return activityID The ID for the activity
	 */
	public int getActivityID() {
		return this.id;
		
	}
	
	/** Sets the starting date of the activity
	 * 
	 * @param newStartTime The starting date of the activity
	 */
	public void setActivityStart(LocalDate startDate) {
		this.startDate = startDate;
		
	}
	
	/** Returns the starting date of the activity
	 * 
	 * @return the starting date of the activity
	 */
	public LocalDate getActivityStart() {
		return this.startDate;
		
	}
	
	/**
	 * @param activityDeadline The deadline for the activity
	 */
	public void setActivityDeadline(LocalDate deadLine) {
		this.deadLine = deadLine;
		
	}

	/**
	 * @return deadline The deadline for the activity
	 */
	public LocalDate getDeadline() {
		return this.deadLine;
		
	}

	/**
	 * @param newEmployeeIDs The IDs of the activity's employees
	 */
	public void setAssociatedEmployee(List<Integer> newEmployeeIDs) {
		this.employeeIDs = ((employeeIDs != null) ? employeeIDs : new ArrayList<>());
		
	}

	/**
	 * @return employeeIDs An ordered list of the activity's assigned employees
	 */
	public List<Integer> getAssociatedEmployees() {
		return this.employeeIDs;
		
	}
	
	public String toString() {
		return "Activity{" + "id = " + id + ", Name: " + name + '\'' +
				", Starting Date: " + (startDate != null ? startDate : "N/A") +
				", Deadline: " + (deadLine != null ? deadLine : "N/A") +
				", Employee IDs: " + employeeIDs + "}";
		
	}




}