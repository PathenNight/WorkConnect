// From the conversation.html page


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
        //TODO: Get rid of this later \/\/
        console.log("Conversation selected!");

        //Passes the conversation partner's name to the message page (and takes the user there)
        window.location.href = `message.html?conversationPartner=${encodeURIComponent(conversationPartner)}`;
    });
}