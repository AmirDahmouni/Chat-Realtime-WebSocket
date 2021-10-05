const router = require("express").Router();
const Conversationcontroller=require("../controllers/conversation")


router.post("/",Conversationcontroller.newConversation);
router.post("/:userId",Conversationcontroller.getConversationByUserId);
router.get("/find/:firstUserId/:secondUserId",Conversationcontroller.getConversationByUsersIds);

module.exports = router;