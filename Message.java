public class Message {
    private int messageID;
    private int senderID; //Or we could do email? Depends on what key we use
    private int recipientID;
    private String messageContents;

    //Constructors
    public Message(int newSenderID, int newRecipientID) {
        this.senderID = newSenderID;
        this.recipientID = newRecipientID;
        //generate a messageID in SQL
    }

    public Message(int newSenderID, int newRecipientID, String newMessageContents) {
        this.senderID = newSenderID;
        this.recipientID = newRecipientID;
        this.messageContents = newMessageContents;
        //generate a messageID in SQL
    }

    //Getters and setters

    public int getSenderID() {
        return this.senderID;
    }

    public void setNewRecipientID(int newRecipientID) {
        this.recipientID = newRecipientID;
    }

    public int getRecipientID() {
        return this.recipientID;
    }

    public void setNewMessageContents(String newMessageContents) {
        this.messageContents = newMessageContents;
    }

    public String getMessageContents() {
        return this.messageContents;
    }
}