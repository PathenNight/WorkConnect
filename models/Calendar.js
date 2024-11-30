// models/calendar.js
class Calendar {
  constructor() {
    this.activities = [];
  }

  createActivity(name, startMonth, startDay, startYear, endMonth, endDay, endYear) {
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);
    const activity = new Activity(name, startDate, endDate);
    this.activities.push(activity);
  }

  displayCalendar(year, month) {
    this.printMonth(year, month);
    this.printActivitiesInMonth(year, month);
  }

  displayCalendarYear(year) {
    for (let month = 1; month <= 12; month++) {
      this.displayCalendar(year, month);
    }
  }

  printMonth(year, month) {
    const date = new Date(year, month - 1, 1);
    const numberOfDaysInMonth = new Date(year, month, 0).getDate();
    const startDay = date.getDay();

    console.log(`\n ${date.toLocaleString('default', { month: 'long' })} ${year}`);
    console.log('Su Mo Tu We Th Fr Sa');

    let space = '   '.repeat(startDay);
    process.stdout.write(space);

    for (let day = 1; day <= numberOfDaysInMonth; day++) {
      process.stdout.write(`${String(day).padStart(2, ' ')} `);
      if ((day + startDay) % 7 === 0) {
        console.log();
      }
    }
    console.log();
  }

  printActivitiesInMonth(year, month) {
    const activitiesInMonth = this.getActivitiesInMonth(year, month);
    console.log(`\nTasks and Projects for ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })}:`);
    activitiesInMonth.forEach(activity => {
      console.log(` - ${activity.name} | Starting Date: ${activity.activityStart.toDateString()} | Deadline: ${activity.deadline.toDateString()}`);
    });
  }

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

module.exports = Calendar;
