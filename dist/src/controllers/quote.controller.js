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
exports.QuoteController = void 0;
const data_source_1 = require("../config/data-source");
const service_entity_1 = require("../models/service.entity");
const quote_entity_1 = require("../models/quote.entity");
class QuoteController {
    static createQuote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phonenumber, message, recaptchaToken, servicesIds } = req.body;
            if (!name || !email || !phonenumber || !message || !servicesIds) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const ServiceRepository = data_source_1.AppDataSource.getRepository(service_entity_1.Service);
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
                const services = yield ServiceRepository.findByIds(servicesIds);
                if (services.length !== servicesIds.length) {
                    return res.status(404).json({ message: "One or more services not found" });
                }
                const quoteRepository = data_source_1.AppDataSource.getRepository(quote_entity_1.Quote);
                const quote = new quote_entity_1.Quote();
                quote.name = name;
                quote.email = email;
                quote.phonenumber = phonenumber;
                quote.message = message;
                quote.services = services;
                yield quoteRepository.save(quote);
                return res.status(201).json(quote);
            }
            catch (error) {
                console.error('Error creating quote:', error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static getAllQuote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const quoteRepository = data_source_1.AppDataSource.getRepository(quote_entity_1.Quote);
            try {
                const quotes = yield quoteRepository.find({ relations: ['services'] });
                return res.status(200).json(quotes);
            }
            catch (error) {
                console.error('Error fetching quote:', error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static getQuoteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const quoteRepository = data_source_1.AppDataSource.getRepository(quote_entity_1.Quote);
            try {
                const quote = yield quoteRepository.findOne({ where: { id }, relations: ['services'] });
                if (!quote) {
                    return res.status(404).json({ message: "Quote not found" });
                }
                return res.status(200).json(quote);
            }
            catch (error) {
                console.error('Error fetching quote by ID:', error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static deleteMultipleQuotes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ids } = req.body;
            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ message: "No quote IDs provided" });
            }
            const quoteRepository = data_source_1.AppDataSource.getRepository(quote_entity_1.Quote);
            try {
                const quotes = yield quoteRepository.findByIds(ids);
                if (quotes.length === 0) {
                    return res.status(404).json({ message: "No quotes found with the provided IDs" });
                }
                yield quoteRepository.remove(quotes);
                return res.status(200).json({ message: "Quotes deleted successfully", ids });
            }
            catch (error) {
                console.error('Error deleting quotes:', error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static updateQuoteReadStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, read } = req.body;
            if (typeof read !== 'boolean') {
                return res.status(400).json({ message: "Invalid read status" });
            }
            const quoteRepository = data_source_1.AppDataSource.getRepository(quote_entity_1.Quote);
            try {
                const quote = yield quoteRepository.findOne({ where: { id } });
                if (!quote) {
                    return res.status(404).json({ message: "Quote not found" });
                }
                quote.read = read;
                yield quoteRepository.save(quote);
                return res.status(200).json(quote);
            }
            catch (error) {
                console.error('Error updating quote read status:', error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
}
exports.QuoteController = QuoteController;
