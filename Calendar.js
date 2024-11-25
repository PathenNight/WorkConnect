class Calendar {
    constructor() {
      // Stores activities for the calendar
      this.activities = [];
    }
  
    // Creates an activity with a name and start/end dates
    createActivity(name, startMonth, startDay, startYear, endMonth, endDay, endYear) {
      const startDate = new Date(startYear, startMonth - 1, startDay); // Months are 0-indexed in JavaScript Date
      const endDate = new Date(endYear, endMonth - 1, endDay);
      const activity = new Activity(name, startDate, endDate);
      this.activities.push(activity);
    }
  
    // Display the calendar for a specific year and month
    displayCalendar(year, month) {
      this.printMonth(year, month);
      this.printActivitiesInMonth(year, month);
    }
  
    // Display the entire year
    displayCalendarYear(year) {
      for (let month = 1; month <= 12; month++) {
        this.displayCalendar(year, month);
      }
    }
  
    // Print the month in the calendar
    printMonth(year, month) {
      const date = new Date(year, month - 1, 1); // Start of the month
      const numberOfDaysInMonth = new Date(year, month, 0).getDate(); // Number of days in the month
      const startDay = date.getDay(); // The first day of the week (0-Sunday, 1-Monday, etc.)
  
      console.log(`\n ${date.toLocaleString('default', { month: 'long' })} ${year}`);
      console.log('Su Mo Tu We Th Fr Sa');
  
      // Add leading spaces for the first week
      let space = '   '.repeat(startDay);
      process.stdout.write(space);
  
      // Print the days of the month
      for (let day = 1; day <= numberOfDaysInMonth; day++) {
        process.stdout.write(`${String(day).padStart(2, ' ')} `);
        if ((day + startDay) % 7 === 0) {
          console.log(); // New line after each week
        }
      }
      console.log(); // Ensure the final line ends properly
    }
  
    // Print activities for the specified month
    printActivitiesInMonth(year, month) {
      const activitiesInMonth = this.getActivitiesInMonth(year, month);
      console.log(`\nTasks and Projects for ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })}:`);
      activitiesInMonth.forEach(activity => {
        console.log(` - ${activity.name} | Starting Date: ${activity.activityStart.toDateString()} | Deadline: ${activity.deadline.toDateString()}`);
      });
    }
  
    // Get activities that fall within the specified month and year
    getActivitiesInMonth(year, month) {
      return this.activities.filter(activity => {
        const startDate = activity.activityStart;
        const endDate = activity.deadline;
  
        return (startDate.getFullYear() === year && startDate.getMonth() + 1 === month) ||
               (endDate.getFullYear() === year && endDate.getMonth() + 1 === month);
      });
    }
  }
  
  class Activity {
    constructor(name, activityStart, deadline) {
      this.name = name;
      this.activityStart = activityStart;
      this.deadline = deadline;
    }
  }
  
  // Example usage:
  const calendar = new Calendar();
  
  // Creating sample activities
  calendar.createActivity("Create Login Page", 5, 10, 2024, 5, 15, 2024);
  calendar.createActivity("Test", 11, 11, 2024, 11, 11, 2024);
  
  // Displaying the calendar for the entire year of 2024
  calendar.displayCalendarYear(2024);
  
  // Displaying October of 2024
  calendar.displayCalendar(2024, 10);
  