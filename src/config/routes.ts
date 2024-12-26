import express from 'express';
import { authRouter } from '../routes/auth.route';
import { userRouter } from '../routes/user.route';
import { categoryRouter } from '../routes/category.route';
import { serviceRouter } from '../routes/service.route';
import { contactRouter } from '../routes/contact.route';
import { quoteRouter } from '../routes/quote.route';
import { reviewRouter } from '../routes/review.route';


const router = express.Router();

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/category', categoryRouter);
router.use('/service', serviceRouter);
router.use("/contact", contactRouter);
router.use("/quote", quoteRouter);
router.use("/review", reviewRouter);




export default router;
