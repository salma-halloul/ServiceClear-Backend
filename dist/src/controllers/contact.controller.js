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
exports.ContactController = void 0;
const data_source_1 = require("../config/data-source");
const contact_entity_1 = require("../models/contact.entity");
class ContactController {
    static createContact(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, phonenumber, message, recaptchaToken } = req.body;
            if (!name || !email || !phonenumber || !message) {
                return res.status(400).json({ message: "All fields are required" });
            }
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
                const contactRepository = data_source_1.AppDataSource.getRepository(contact_entity_1.Contact);
                const contact = new contact_entity_1.Contact();
                contact.name = name;
                contact.email = email;
                contact.phonenumber = phonenumber;
                contact.message = message;
                yield contactRepository.save(contact);
                return res.status(201).json(contact);
            }
            catch (error) {
                console.error('Error creating contact:', error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static getAllContacts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const contactRepository = data_source_1.AppDataSource.getRepository(contact_entity_1.Contact);
            try {
                const contacts = yield contactRepository.find();
                return res.status(200).json(contacts);
            }
            catch (error) {
                console.error('Error fetching contacts:', error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static getContactById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const contactRepository = data_source_1.AppDataSource.getRepository(contact_entity_1.Contact);
            try {
                const contact = yield contactRepository.findOne({ where: { id } });
                if (!contact) {
                    return res.status(404).json({ message: "Contact not found" });
                }
                return res.status(200).json(contact);
            }
            catch (error) {
                console.error('Error fetching contact by ID:', error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static deleteMultipleContacts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ids } = req.body;
            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).json({ message: "No contact IDs provided" });
            }
            const contactRepository = data_source_1.AppDataSource.getRepository(contact_entity_1.Contact);
            try {
                const contacts = yield contactRepository.findByIds(ids);
                if (contacts.length === 0) {
                    return res.status(404).json({ message: "No contacts found with the provided IDs" });
                }
                yield contactRepository.remove(contacts);
                return res.status(200).json({ message: "Contacts deleted successfully", ids });
            }
            catch (error) {
                console.error('Error deleting contacts:', error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    static updateContactReadStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, read } = req.body;
            if (typeof read !== 'boolean') {
                return res.status(400).json({ message: "Invalid read status" });
            }
            const contactRepository = data_source_1.AppDataSource.getRepository(contact_entity_1.Contact);
            try {
                const contact = yield contactRepository.findOne({ where: { id } });
                if (!contact) {
                    return res.status(404).json({ message: "Contact not found" });
                }
                contact.read = read;
                yield contactRepository.save(contact);
                return res.status(200).json(contact);
            }
            catch (error) {
                console.error('Error updating contact read status:', error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
}
exports.ContactController = ContactController;
