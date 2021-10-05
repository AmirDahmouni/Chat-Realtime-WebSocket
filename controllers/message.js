
const Message = require("../models/Message");
const Conversation=require("../models/Conversation")


exports.newMessage=async (req, res) => {
  console.log(req.body)
    try {
      
      const newMessage = new Message(req.body);
      const savedMessage = await newMessage.save();
      await Conversation.findByIdAndUpdate(req.body.conversationId,{ $push: { messages:savedMessage._id }})
      if(!savedMessage) return res.status(400).json('failed creation')
      return res.status(200).json(savedMessage);
    } catch (err) {
      return res.status(500).json(err);
    }
}

exports.getByConversationId=async (req, res) => {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      if(!messages) return res.status(404).json("not found")
       return res.status(200).json(messages);
    } catch (err) {
      return res.status(500).json(err);
    }
  }