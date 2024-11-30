package java;

import java.time.*;
import java.util.*;

/**
 * Generic class for every object that could have a deadline,
 * employees assigned to it, and a name.
 */
public class Activity {
    private static int idCounter = 1;
    private int id;
    private String name;
    private List<Integer> employeeIDs;
    private LocalDate deadline;
    private LocalDate startDate;

    public Activity() {
        this("Unnamed Activity", null, null);
    }

    public Activity(String name) {
        this(name, null, null);
    }

    public Activity(String name, LocalDate deadline) {
        this(name, null, deadline);
    }

    public Activity(String name, LocalDate startDate, LocalDate deadline) {
        this.id = idCounter++;
        this.name = name != null ? name : "Unnamed Activity";
        this.startDate = startDate;
        this.deadline = deadline;
        this.employeeIDs = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        if (name != null) {
            this.name = name;
        }
    }

    public int getId() {
        return id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public List<Integer> getEmployeeIDs() {
        return employeeIDs;
    }

    public void setEmployeeIDs(List<Integer> employeeIDs) {
        this.employeeIDs = employeeIDs != null ? employeeIDs : new ArrayList<>();
    }

    @Override
    public String toString() {
        return "Activity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", startDate=" + (startDate != null ? startDate : "N/A") +
                ", deadline=" + (deadline != null ? deadline : "N/A") +
                ", employeeIDs=" + employeeIDs +
                '}';
    }
}
