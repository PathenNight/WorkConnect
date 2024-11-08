/**Generic class for every object that represents a user of our
 * software. Could include employees, managers, admins, etc.
 * 
 */
public class User {
    private int id; //Genereated with autoincrement in SQL
    private String email;
    private String firstName;
    private String lastName;

    //Constructors

    public User(String newEmail) {
        //Generate an id
        this.email = newEmail;
    }

    public User(String newEmail, String newFirstName, String newLastName) {
        //Generate an id
        this.email = newEmail;
        this.firstName = newFirstName;
        this.lastName = newLastName;
    }

    public User(int newID, String newEmail, String newFirstName, String newLastName) {
        this.id = newID;
        this.email = newEmail;
        this.firstName = newFirstName;
        this.lastName = newLastName;
    }



    //Everything below are getter/setter methods

    /**
     * @param newID The new ID of the user
     */
    public void setID(int newID) {
        /*Because IDs are generated in SQL, this is mostly for the java object.
        Other methods may actually write to the database, but this might not.*/
        this.id = newID;
    }

    /**
     * @return the ID of the user
     */
    public int getID() {
        return this.id;
    }

    /**
     * @param newEmail The new email address of the user
     */
    public void setEmail(String newEmail) {
        this.email = newEmail;
    }

    /**
     * @return email The email address of the user
     */
    public String getEmail() {
        return this.email;
    }

    /**
     * @param newFirstName The new first name of the user
     */
    public void setFirstName(String newFirstName) {
        this.firstName = newFirstName;
    }

    /**
     * @return firstName The first name of the user
     */
    public String getFirstName() {
        return this.firstName;
    }

    /**
     * @param newLastName The new last name of the user
     */
    public void setLastName(String newLastName) {
        this.lastName = newLastName;
    }

    /**
     * @return lastName The last name of the user
     */
    public String getLastName() {
        return this.lastName;
    }
}