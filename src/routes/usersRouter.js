import { Router } from "express";
import passport from "passport";
import UserController from "../controllers/user.controlllers.js";
import { authorizationRole, passportCall } from "../middlewares/sessions.js";
import { uploader } from "../middlewares/multer.js";


const controller = new UserController();
const router = Router();

router.get("/", controller.getAll)
router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/register-github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/profile-github", passport.authenticate("github", { scope: ["user:email"] }), controller.github);
router.get("/perfil", passportCall("jwt"), controller.perfil);
router.post("/logout", controller.logout);
router.post("/resetpassword", controller.resetpassword);
router.put("/premium/:uid", controller.changeRole);
router.post("/:uid/documents", uploader.any(), controller.uploadDocuments);
router.delete("/", passport.authenticate("jwt"), authorizationRole(["admin"]), controller.deleteUsers)

export default router;
