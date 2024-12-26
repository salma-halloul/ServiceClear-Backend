import { Request, Response } from "express";
import { Review } from "../models/review.entity";
import { AppDataSource } from "../config/data-source";
import { EReview } from "../models/enums/EReview";

export class ReviewController {
  static async createReview(req: Request, res: Response): Promise<Response> {
    const { rating, comment, name } = req.body;
    const reviewRepository = AppDataSource.getRepository(Review);

    try {
      const review = new Review();
      review.rating = rating;
      review.comment = comment;
      review.name = name;
      review.status = EReview.PENDING;

      await reviewRepository.save(review);
      return res.status(201).json(review);
    } catch (error) {
      return res.status(500).json({ message: "Error creating review", error });
    }
  }


  static async addReviewByAdmin(req: Request, res: Response): Promise<Response> {
    const { rating, comment, name} = req.body;
    const reviewRepository = AppDataSource.getRepository(Review);

    try {
      const review = new Review();
      review.rating = rating;
      review.comment = comment;
      review.name =name;
      review.status = EReview.APPROVED;

      await reviewRepository.save(review);

      return res.status(201).json(review);
    } catch (error) {
      return res.status(500).json({ message: "Error creating review", error });
    }
  }

  static async getAllReviews(req: Request, res: Response): Promise<Response> {
    const reviewRepository = AppDataSource.getRepository(Review);

    try {
      const reviews = await reviewRepository.find();
      return res.json(reviews);
    } catch (error: unknown) {
      console.error('Error fetching reviews:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return res.status(500).json({ message: "Error fetching reviews", error: errorMessage });
    }
  }

  static async getApprovedReviews(req: Request, res: Response): Promise<Response> {
    const reviewRepository = AppDataSource.getRepository(Review);

    try {
      const approvedReviews = await reviewRepository.find({ where: { status: EReview.APPROVED } });
      return res.json(approvedReviews);
    } catch (error: unknown) {
      console.error('Error fetching approved reviews:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return res.status(500).json({ message: "Error fetching approved reviews", error: errorMessage });
    }
  }


  static async updateReviewStatus(req: Request, res: Response): Promise<Response> {
    const { reviewId, status } = req.body;

    if (!Object.values(EReview).includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const reviewRepository = AppDataSource.getRepository(Review);

    try {
      const review = await reviewRepository.findOne({ 
        where: { id: reviewId },
      });

      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      review.status = status;    
      await reviewRepository.save(review);

      return res.status(200).json(review);
    } catch (error) {
      return res.status(500).json({ message: "Error updating review status", error });
    }
  }



}
