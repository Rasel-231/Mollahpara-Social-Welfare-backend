import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

interface ISendEmailPayload {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async (payload: ISendEmailPayload): Promise<void> => {
  await transporter.sendMail({
    from: config.email.from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });
};

export default sendEmail;
