import * as express from "express";
import { UserController } from "../controllers/user.controller";
import { authentification } from "../middlewares/auth.middleware";

const Router = express.Router();

Router.get("/getprofile", authentification, UserController.getProfile);
Router.put("/updateprofile", authentification, UserController.updateProfile);
Router.put("/resetpassword", authentification, UserController.resetPassword);


export { Router as userRouter };