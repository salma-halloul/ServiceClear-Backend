import * as express from "express";
import { authentification } from "../middlewares/auth.middleware";
import { QuoteController } from "../controllers/quote.controller";

const Router = express.Router();

Router.get("/monthly-request", QuoteController.getMonthlyQuotesStatistics);
Router.post("/create", QuoteController.createQuote);
Router.get("/getall",authentification, QuoteController.getAllQuote);
Router.get("/:id", authentification,QuoteController.getQuoteById);
Router.delete("/delete",authentification,  QuoteController.deleteMultipleQuotes);
Router.put("/update",authentification, QuoteController.updateQuoteReadStatus);
Router.patch("/update-status", authentification,QuoteController.updateQuoteStatus);





export { Router as quoteRouter };