package DevProject;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.DayOfWeek;

public class Calendar {
	public static void main(String args[]) {
		LocalDate currentDate = LocalDate.now();

		// Reads the user's system data to automatically get the year, month, and day
		int year = currentDate.getYear();
		int startingMonth = currentDate.getMonthValue();
		int day = currentDate.getDayOfMonth();

		// Testing to see if the correct date is being taken from the user
		// System.out.print("The current date is: " + month + "/" + day +  "/" + year)

		// Loops through the 12 months and prints them all out
		for (int month = 1; month <= 12; month++) {
			printMonth(year, month);
			
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

}
