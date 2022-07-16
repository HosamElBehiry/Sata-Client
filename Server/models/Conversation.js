const mongoose = require("mongoose");
const ConversationSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
},{ timestamps: true });

module.exports = mongoose.model("Conversation", ConversationSchema);
