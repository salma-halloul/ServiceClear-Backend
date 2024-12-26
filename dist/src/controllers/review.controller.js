"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const review_entity_1 = require("../models/review.entity");
const data_source_1 = require("../config/data-source");
const EReview_1 = require("../models/enums/EReview");
class ReviewController {
    static createReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rating, comment, name } = req.body;
            const reviewRepository = data_source_1.AppDataSource.getRepository(review_entity_1.Review);
            try {
                const review = new review_entity_1.Review();
                review.rating = rating;
                review.comment = comment;
                review.name = name;
                review.status = EReview_1.EReview.PENDING;
                yield reviewRepository.save(review);
                return res.status(201).json(review);
            }
            catch (error) {
                return res.status(500).json({ message: "Error creating review", error });
            }
        });
    }
    static addReviewByAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rating, comment, name } = req.body;
            const reviewRepository = data_source_1.AppDataSource.getRepository(review_entity_1.Review);
            try {
                const review = new review_entity_1.Review();
                review.rating = rating;
                review.comment = comment;
                review.name = name;
                review.status = EReview_1.EReview.APPROVED;
                yield reviewRepository.save(review);
                return res.status(201).json(review);
            }
            catch (error) {
                return res.status(500).json({ message: "Error creating review", error });
            }
        });
    }
    static getAllReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviewRepository = data_source_1.AppDataSource.getRepository(review_entity_1.Review);
            try {
                const reviews = yield reviewRepository.find();
                return res.json(reviews);
            }
            catch (error) {
                console.error('Error fetching reviews:', error);
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                return res.status(500).json({ message: "Error fetching reviews", error: errorMessage });
            }
        });
    }
    static getApprovedReviews(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviewRepository = data_source_1.AppDataSource.getRepository(review_entity_1.Review);
            try {
                const approvedReviews = yield reviewRepository.find({ where: { status: EReview_1.EReview.APPROVED } });
                return res.json(approvedReviews);
            }
            catch (error) {
                console.error('Error fetching approved reviews:', error);
                const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
                return res.status(500).json({ message: "Error fetching approved reviews", error: errorMessage });
            }
        });
    }
    static updateReviewStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { reviewId, status } = req.body;
            if (!Object.values(EReview_1.EReview).includes(status)) {
                return res.status(400).json({ message: "Invalid status" });
            }
            const reviewRepository = data_source_1.AppDataSource.getRepository(review_entity_1.Review);
            try {
                const review = yield reviewRepository.findOne({
                    where: { id: reviewId },
                });
                if (!review) {
                    return res.status(404).json({ message: "Review not found" });
                }
                review.status = status;
                yield reviewRepository.save(review);
                return res.status(200).json(review);
            }
            catch (error) {
                return res.status(500).json({ message: "Error updating review status", error });
            }
        });
    }
}
exports.ReviewController = ReviewController;
