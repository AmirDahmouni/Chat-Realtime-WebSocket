const router = require("express").Router();
const MessageController=require("../controllers/message")



router.post("/",MessageController.newMessage);
router.get("/:conversationId",MessageController.getByConversationId);


module.exports = router;