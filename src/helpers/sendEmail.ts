import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

class EmailService {
	static async sendEmail(email: string, subject: string, templatePath: string, variables: { [key: string]: string }): Promise<void> {
		const transporter = nodemailer.createTransport({
	  service: 'Gmail',
	  auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	  },
	});

	    // Lire le fichier de modèle HTML
		const template = fs.readFileSync(path.resolve(templatePath), 'utf-8');

		// Remplacer les variables dans le modèle
		const html = template.replace(/{{(\w+)}}/g, (_, key) => variables[key] || '');
	

	const mailOptions = {
	  from: process.env.SMTP_USER,
	  to: email,
	  subject: subject,
	  html: html,
	};

	await transporter.sendMail(mailOptions);
  }
}

export default EmailService;