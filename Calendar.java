package DevProject;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

public class Calendar {
	// Creates a new list of activities and stores them in an array list
	private List<Activity> activities;

	public Calendar() {
		activities = new ArrayList<>();

	}

	public static void main(String args[]) {
		Calendar calendar = new Calendar();

		// Testing to simulate user input
		calendar.createActivity("Create Login Page", 10, 5, 2024, 10, 15, 2024);
		calendar.createActivity("Test", 11, 11, 2024, 11, 11, 2024);

		calendar.displayCalendar(2024); // Displays the entire year of 2024
		calendar.displayCalendar(2024, 10); // Displays only October of 2024


	}


	public void createActivity(String name, int startMonth, int startDay, int startYear, int endMonth, int endDay, int endYear) {
		LocalDate startDate = LocalDate.of(startYear, startMonth, startDay);
		LocalDate deadLine = LocalDate.of(endYear, endMonth, endDay);
		Activity activity = new Activity(name, startDate, deadLine);
		activities.add(activity);

	}

	private void displayCalendar(int year, int month) {
		printMonth(year, month);
		printActivitiesInMonth(year, month);

	}

	private void displayCalendar(int year) {
		for (int month = 1; month <= 12; month++) {
			displayCalendar(year, month);

		}
	}

	public static void printMonth(int year, int month) {
		// Gets the number of days in the current month based on the current date
		YearMonth yearMonth = YearMonth.of(year, month);
		int numberOfDaysInMonth = yearMonth.lengthOfMonth();

		// Testing to see if the current number of days in the month is correct
		// System.out.print("The number of days in the current month are: " + numberOfDaysInMonth);

		// Gets the day that the month starts on
		LocalDate firstDayOfMonth = yearMonth.atDay(1);
		DayOfWeek startDay = firstDayOfMonth.getDayOfWeek();

		// Testing to see if the day that the month starts on the correct day
		// System.out.print("The current month starts on: " + startDay);

		// Header for the current month
		System.out.println("\n " + yearMonth.getMonth() + " " + year);
		System.out.println("Su Mo Tu We Th Fr Sa");

		// Determines how much space is given at the start of the month for the first day
		int dayOfWeekSpace = startDay.getValue();
		int startingDay = (dayOfWeekSpace % 7);
		// Prints out the initial spaces at the start of the month
		for (int i = 0; i < startingDay; i++)
			System.out.print("   ");

		// Prints out the days(numbers) of the month
		for (int i = 1; i <= numberOfDaysInMonth; i++) {
			System.out.printf("%2d ", i);
			if ((i + startingDay) % 7 == 0)
				System.out.println();

		}
		System.out.println();

	}

	private void printActivitiesInMonth(int year, int month) {
		List<Activity> thisMonthsActivities = getActivitiesInMonth(year, month);
		System.out.println("\nTasks and Projects for " + YearMonth.of(year, month).getMonth() + ":");
		for (Activity activity : thisMonthsActivities) {
			System.out.println(" - " + activity.getName() + 
					" | Starting Date: " + (activity.getActivityStart() != null ? activity.getActivityStart() : "N/A") + 
					" | Deadline: " + (activity.getDeadline() != null ? activity.getDeadline() : "N/A"));

		}

	}


	public List<Activity> getActivitiesInMonth(int year, int month) {
		List<Activity> thisMonthsActivities = new ArrayList<>();
		for (Activity activity : activities) {
			LocalDate startDate = activity.getActivityStart();
			LocalDate deadLine = activity.getDeadline();
			if ((startDate != null && startDate.getYear() == year && startDate.getMonthValue() == month) ||
					(deadLine != null && deadLine.getYear() == year && deadLine.getMonthValue() == month)) {
				thisMonthsActivities.add(activity);

			}
		}
		return thisMonthsActivities;

	}

}
