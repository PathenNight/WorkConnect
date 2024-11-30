class User {
    constructor(id = null, email, firstName = '', lastName = '', role = 'employee') {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role; // Default to 'employee'
    }

    // Getter and setter methods
    setID(newID) {
        this.id = newID;
    }

    getID() {
        return this.id;
    }

    setEmail(newEmail) {
        this.email = newEmail;
    }

    getEmail() {
        return this.email;
    }

    setFirstName(newFirstName) {
        this.firstName = newFirstName;
    }

    getFirstName() {
        return this.firstName;
    }

    setLastName(newLastName) {
        this.lastName = newLastName;
    }

    getLastName() {
        return this.lastName;
    }

    setRole(newRole) {
        this.role = newRole;
    }

    getRole() {
        return this.role;
    }
}

module.exports = User;
