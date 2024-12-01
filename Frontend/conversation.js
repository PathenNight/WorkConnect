/**Allows the user to search for a conversation partner via username
 * 
*/
document.addEventListener('DOMContentLoaded', function() {
    function submitEvent(event) {
        event.preventDefault();  // Prevents the form from refreshing the page

        // Get the value of the user's message
        const partnerName = document.getElementById("userSearchBox").value;
        console.log(partnerName);

        // Check if the message is not empty
        if (partnerName.trim() !== "") {
            // Add the message to the chat box
            addConversation(partnerName);

            // Clear the input field after sending
            document.getElementById("userSearchBox").value = "";
        } else {
            alert("Please type a message before submitting!");
        }
    }

    // Attach the event listener
    document.getElementById("userSearch").addEventListener("submit", submitEvent);
});



/**Adds a new conversation
 * 
 * @param {*} conversationPartner The conversation partner that the user is communicating with
 */
function addConversation(conversationPartner) {
    const conversationBox = document.getElementById("conversationBox");

    // Create a div to represent the conversation
    const conversationDiv = document.createElement("div");
    conversationDiv.classList.add("conversation");

    //Adds the text for the conversation partner
    conversationDiv.innerHTML = `${conversationPartner}`;

    // Append the new conversation to the conversation box
    conversationBox.appendChild(conversationDiv);

    // Scroll the conversation box to the bottom after the conversation is added
    conversationDiv.scrollTop = conversationBox.scrollHeight;
    
    //Add an event listener to the newly added conversation
    conversationDiv.addEventListener('click', function() {
        //Passes the conversation partner's name to the message page (and takes the user there)
        window.location.href = `message.html?conversationPartner=${encodeURIComponent(conversationPartner)}`;
    });
}