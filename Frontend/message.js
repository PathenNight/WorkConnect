// Initialize a variable to keep track of who is sending the next message
let currentSender = "Person A";

userName = "John";

const params = new URLSearchParams(window.location.search);
const partnerName = params.get('conversationPartner');
console.log(partnerName);


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

    // Add appropriate class for user or their conversation partner
    if (sender === userName) {
        messageDiv.classList.add("message-user");
        messageDiv.innerHTML = `<strong>${userName}:</strong> ${message}`;
    } else {
        messageDiv.classList.add("message-partner");
        messageDiv.innerHTML = `<strong>${partnerName}:</strong> ${message}`;
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
            addMessage(userName, userMessage);

            // Clear the input field after sending
            document.getElementById("userMessage").value = "";

            // Toggle the sender for the next message
            currentSender = currentSender === userName ? partnerName : userName;
        } else {
            alert("Please type a message before submitting!");
        }
    }

    // Attach the event listener
    document.getElementById("messageForm").addEventListener("submit", submitEvent);
});
