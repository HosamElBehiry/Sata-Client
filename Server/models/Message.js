const mongoose = require("mongoose");
const MessageSchema = mongoose.Schema({
  conversationId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation"
  },
  text: {
    type: String,
  }
},{ timestamps: true });

module.exports = mongoose.model("Message", MessageSchema);
