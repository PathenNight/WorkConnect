// Import the User class
const User = require('./User'); // Adjust the path based on your file structure

class Employee extends User {
  constructor(id, email, firstName, lastName, isAdmin = false, managerID = null) {
    super(id, email, firstName, lastName); // Call the parent constructor
    this.isAdmin = isAdmin;
    this.managerID = managerID;
  }

  // Getter and Setter for Manager ID
  getManagerID() {
    return this.managerID;
  }

  setManagerID(managerID) {
    this.managerID = managerID;
  }

  // Getter and Setter for isAdmin
  getIsAdmin() {
    return this.isAdmin;
  }

  setIsAdmin(isAdmin) {
    this.isAdmin = isAdmin;
  }

  // Method to join a company server
  joinCompanyServer(employeeID, companyServer) {
    if (this.id === employeeID) {
      console.log(`Employee ${this.firstName} ${this.lastName} has joined the ${companyServer} server.`);
      return true; // Could add more logic to actually join a server
    } else {
      console.log(`Invalid Employee ID. Access denied.`);
      return false;
    }
  }
}

module.exports = Employee;
