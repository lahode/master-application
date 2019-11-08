import * as nodemailer from 'nodemailer';
import { CONFIG } from "../../config";

export class Mailer {

  public static async sendMail(subject: string, email: string, message: string) {

    // Initialize e-mail parameters.
    const transporter = nodemailer.createTransport(CONFIG.MAILER);
    const mailOptions = {
      from: CONFIG.MAILER.sender,
      replyTo: CONFIG.MAILER.sender,
      to: email,
      subject,
      html: ''
    };

    try {
      mailOptions.html = message;

      // Send the e-mail to the e-mail.
      const sendmail = await transporter.sendMail(mailOptions);
      return { mailID: sendmail.response, success:true };
    }
    catch (e) {
      throw (e);
    }
  }
}
