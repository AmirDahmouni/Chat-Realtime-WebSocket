const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Types.ObjectId, ref: 'Message' }]
  },
  {timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);