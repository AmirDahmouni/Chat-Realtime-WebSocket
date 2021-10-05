const Conversation = require("../models/Conversation");


exports.newConversation=async (req, res) => {
    try 
    {
     const newConversation = new Conversation({
            users: [req.body.senderId, req.body.receiverId],
      });
      const savedConversation = await newConversation.save();
      if(!savedConversation) return res.status(400).json("failed creation")
      return res.status(200).json(savedConversation);
    } 
    catch (err) {
      return res.status(500).json(err);
    }
}

exports.getConversationByUserId=async (req, res) => {
  
    try {
      const conversation = await Conversation.find({  
        users:{$in: [req.body.connectedUsers]}  
      }).populate("messages");
      if(!conversation) return res.status(404).json("not found")
      return res.status(200).json(conversation);
    } catch (err) {
      return res.status(500).json(err);
    }
}

exports.getConversationByUsersIds=async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        users: { $all: [req.params.firstUserId, req.params.secondUserId] },
      }).populate("messages");
      if(conversation) return res.status(404).json("not found")
      return res.status(200).json(conversation)
    } catch (err) {
      return res.status(500).json(err);
    }
}