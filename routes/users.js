
const router = require("express").Router();
const UserController=require("../controllers/user")
const checkAuth=require("../middlewares/checkAuth")

router.get("/conversations",checkAuth,UserController.getAllConversations)
router.get("/", UserController.getById);
router.post("/register",UserController.uploadImage,UserController.register);
router.post("/login", UserController.login);
router.post("/conversationsOnline",checkAuth,UserController.getConversationsOnline)
router.post("/search",checkAuth,UserController.findConversationByUser)
router.put("/",checkAuth,UserController.update)
router.put("/logout",checkAuth,UserController.logout)
router.put("/updateImage",checkAuth,UserController.updateImage)
router.delete("/:id", UserController.delete)

module.exports = router;