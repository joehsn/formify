import path from 'path';
import ejs from 'ejs';
import { z } from 'zod';
import nodemailer from 'nodemailer';

interface sendEmailProps {
  name: string;
  resetLink: string;
  email: string;
}

/**
 * Send email to user with reset link for password reset
 * @param name, resetLink, email
 */
async function sendEmail({
  name,
  resetLink,
  email,
}: sendEmailProps): Promise<void> {
  try {
    const envars = z
      .object({
        SMTP_HOST: z.string(),
        SMTP_PORT: z.string(),
        SMTP_USERNAME: z.string(),
        SMTP_PASSWORD: z.string(),
        USER_EMAIL: z.string(),
      })
      .parse(process.env);
    const transport = nodemailer.createTransport({
      auth: {
        user: envars.SMTP_USERNAME,
        pass: envars.SMTP_PASSWORD,
      },
      host: envars.SMTP_HOST,
      port: envars.SMTP_PORT,
      secure: false,
    });

    const emailTemplate = await ejs.renderFile(
      path.join(__dirname, '..', 'views', 'email.ejs'),
      {
        name,
        resetLink,
      }
    );

    // Email options
    const mailOptions = {
      from: envars.USER_EMAIL,
      to: email,
      subject: 'Password Reset Request | Formify',
      html: emailTemplate,
    };

    // Send email
    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
}

export default sendEmail;
