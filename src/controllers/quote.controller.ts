import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Service } from '../models/service.entity';
import { Quote } from '../models/quote.entity';
import { EQuote } from '../models/enums/EQuote';


export class QuoteController {
    static async createQuote(req: Request, res: Response): Promise<Response> {
        const { name, email, phonenumber, message, recaptchaToken, servicesIds } = req.body;

        if (!name || !email || !phonenumber || !message || !servicesIds) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const ServiceRepository = AppDataSource.getRepository(Service);
        

        try {

           /* // Vérifiez le captcha avec le service reCAPTCHA de Google
            const captchaResponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
                params: {
                    secret: process.env.RECAPTCHA_SECRET_KEY,
                    response: recaptchaToken
                }
            });

            console.log('Captcha response:', captchaResponse.data);

            if (!captchaResponse.data.success) {
                return res.status(400).json({ message: "Captcha validation failed", errorCodes: captchaResponse.data['error-codes'] });
            }*/

            const services = await ServiceRepository.findByIds(servicesIds);
            if (services.length !== servicesIds.length) {
                return res.status(404).json({ message: "One or more services not found" });
            }

            const quoteRepository = AppDataSource.getRepository(Quote);

            const quote = new Quote();
            quote.name = name;
            quote.email = email;
            quote.phonenumber = phonenumber;
            quote.message = message;
            quote.services = services;

            await quoteRepository.save(quote);

            return res.status(201).json(quote);
        } catch (error) {
            console.error('Error creating quote:', error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getAllQuote(req: Request, res: Response): Promise<Response> {
        const quoteRepository = AppDataSource.getRepository(Quote);
    
        try {
          const quotes = await quoteRepository.find({ relations: ['services'] });
          return res.status(200).json(quotes);
        } catch (error) {
          console.error('Error fetching quote:', error);
          return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getQuoteById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const quoteRepository = AppDataSource.getRepository(Quote);
    
        try {
          const quote = await quoteRepository.findOne({ where: { id }, relations: ['services'] });
    
          if (!quote) {
            return res.status(404).json({ message: "Quote not found" });
          }
    
          return res.status(200).json(quote);
        } catch (error) {
          console.error('Error fetching quote by ID:', error);
          return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async deleteMultipleQuotes(req: Request, res: Response): Promise<Response> {
        const { ids } = req.body;
    
        if (!Array.isArray(ids) || ids.length === 0) {
          return res.status(400).json({ message: "No quote IDs provided" });
        }
    
        const quoteRepository = AppDataSource.getRepository(Quote);
    
        try {
          const quotes = await quoteRepository.findByIds(ids);
    
          if (quotes.length === 0) {
            return res.status(404).json({ message: "No quotes found with the provided IDs" });
          }
    
          await quoteRepository.remove(quotes);
    
          return res.status(200).json({ message: "Quotes deleted successfully", ids });
        } catch (error) {
          console.error('Error deleting quotes:', error);
          return res.status(500).json({ message: "Internal server error" });
        }
    }    

    static async updateQuoteReadStatus(req: Request, res: Response): Promise<Response> {
        const { id, read } = req.body;

        if (typeof read !== 'boolean') {
            return res.status(400).json({ message: "Invalid read status" });
        }

        const quoteRepository = AppDataSource.getRepository(Quote);

        try {
            const quote = await quoteRepository.findOne({
              where: { id },
              relations: ['services'],
            });

            if (!quote) {
                return res.status(404).json({ message: "Quote not found" });
            }

            quote.read = read;

            await quoteRepository.save(quote);

            return res.status(200).json(quote);
        } catch (error) {
            console.error('Error updating quote read status:', error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async updateQuoteStatus(req: Request, res: Response): Promise<Response> {
        const { quoteId, status } = req.body;
    
        if (!Object.values(EQuote).includes(status)) {
          return res.status(400).json({ message: "Invalid status" });
        }
    
        const quoteRepository = AppDataSource.getRepository(Quote);
    
        try {
          const quote = await quoteRepository.findOne({
            where: { id: quoteId },
            relations: ['services'],
          });
    
          if (!quote) {
            return res.status(404).json({ message: "Quote not found" });
          }
    
          quote.status = status;
          await quoteRepository.save(quote);
    
          return res.status(200).json(quote);
        } catch (error) {
          return res.status(500).json({ message: "Error updating quote status", error });
        }
      }

      static async getMonthlyQuotesStatistics(req: Request, res: Response): Promise<Response> {
        const quoteRepository = AppDataSource.getRepository(Quote);
    
        try {
          const statistics = await quoteRepository
            .createQueryBuilder("quote")
            .select("DATE_TRUNC('month', quote.createdAt)", "month")
            .addSelect("COUNT(*)", "count")
            .groupBy("month")
            .orderBy("month")
            .getRawMany();
    
          return res.json(statistics);
        } catch (error: unknown) {
          console.error('Error fetching monthly quotes statistics:', error);
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
          return res.status(500).json({ message: "Error fetching monthly quotes statistics", error: errorMessage });
        }
      }


}