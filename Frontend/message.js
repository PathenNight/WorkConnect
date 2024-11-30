// Initialize a variable to keep track of who is sending the next message
let currentSender = "Person A";

/**Adds a message to the chatbox. The appearance changes based on the
 * sender and the message.
 * 
 * @param {*} sender The sender of the message; can either be the user 
 * or their conversation partner
 * @param {*} message The contents of the message sent
 */
function addMessage(sender, message) {
    const chatBox = document.getElementById("chatBox");

    // Create a div to represent the message
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    // Add appropriate class for Person A or Person B
    if (sender === "Person A") {
        messageDiv.classList.add("message-person-a");
        messageDiv.innerHTML = `<strong>Person A:</strong> ${message}`;
    } else {
        messageDiv.classList.add("message-person-b");
        messageDiv.innerHTML = `<strong>Person B:</strong> ${message}`;
    }

    // Append the new message to the chat box
    chatBox.appendChild(messageDiv);

    // Scroll the chat box to the bottom after the message is added
    chatBox.scrollTop = chatBox.scrollHeight;
}

/**Handle form submission
 * 
*/
document.addEventListener('DOMContentLoaded', function() {
    function submitEvent(event) {
        event.preventDefault();  // Prevents the form from refreshing the page

        // Get the value of the user's message
        const userMessage = document.getElementById("userMessage").value;

        // Check if the message is not empty
        if (userMessage.trim() !== "") {
            // Add the message to the chat box
            addMessage(currentSender, userMessage);

            // Clear the input field after sending
            document.getElementById("userMessage").value = "";

            // Toggle the sender for the next message
            currentSender = currentSender === "Person A" ? "Person B" : "Person A";
        } else {
            alert("Please type a message before submitting!");
        }
    }

    // Attach the event listener
    document.getElementById("messageForm").addEventListener("submit", submitEvent);
});
