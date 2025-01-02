import * as express from "express";
import { ReviewController } from "../controllers/review.controller";
import { authentification } from "../middlewares/auth.middleware";

const Router = express.Router();

Router.post("/create", ReviewController.createReview);
Router.post("/add",  authentification, ReviewController.addReviewByAdmin);
Router.get("/all", authentification,  ReviewController.getAllReviews);
Router.patch("/update-status", authentification,ReviewController.updateReviewStatus);
Router.get("/allvisible", ReviewController.getApprovedReviews);
Router.delete('/delete',  authentification, ReviewController.deleteMultipleReviews);


export { Router as reviewRouter };
