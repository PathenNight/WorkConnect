public class Employee extends User {
    int managerID;
    Boolean isAdmin;

    //Constructors
    public Employee(String newEmail) {
        super(newEmail);
    }

    public Employee(String newEmail, String newFirstName, String newLastName) {
        super(newEmail, newFirstName, newLastName);
    }
    
    public Employee(int newID, String newEmail, String newFirstName, String newLastName) {
        super(newID, newEmail, newFirstName, newLastName);
    }

    public Employee(int newID, String newEmail, String newFirstName, String newLastName, Boolean newEmployeeIsAdmin) {
        super(newID, newEmail, newFirstName, newLastName);
        this.isAdmin = newEmployeeIsAdmin;
    }

    public Employee(String newEmail, String newFirstName, String newLastName, Boolean newEmployeeIsAdmin) {
        super(newEmail, newFirstName, newLastName);
        this.isAdmin = newEmployeeIsAdmin;
    }

    //Getters/setters

    public void setManagerID(int newManagerID) {
        this.managerID = newManagerID;
    }

    public int getManagerID() {
        return this.managerID;
    }

    public void setIsAdmin(boolean updatedIsAdmin) {
        this.isAdmin = updatedIsAdmin;
    }

    public boolean isAdmin() {
        return this.isAdmin;
    }

}