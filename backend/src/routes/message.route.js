import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar} from "../controllers/message.controller.js"
import {getConversationsForSidebar} from "../controllers/message.controller.js"
import {getMessages} from "../controllers/message.controller.js"
import {sendMessages} from "../controllers/message.controller.js"
import { upload } from "../middleware/upload.middleware.js";


const router = express.Router();
router.use(protectRoute);
router.get("/users", getUsersForSidebar);
router.get("/conversations",getConversationsForSidebar);
router.get("/:id", getMessages);
router.post("/send/:id",upload.single("media"), sendMessages);


export default router;