
import java.time.*;

public class Main {
    /**Solely for testing purposes. This can be changed later.*/
    public static void main(String args[]) {
        Project project1 = new Project("Roll out new update");

        LocalDate onboardingDate = LocalDate.parse("2024-08-20");
        Project project2 = new Project("Hiring Process", onboardingDate);

        System.out.println(project1.getName());

        System.out.println(project2.getName() + " is due by " + project2.getDeadline() + ".");
    }
}