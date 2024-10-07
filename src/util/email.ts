import nodemailer from 'nodemailer';
import { smtpPassword, smtpService, smtpUser } from '../config/constants';
import APIError from '../middleware/errors/error';
import { HTTPStatusCode } from '../enums/http';


const SMTPTransporter = nodemailer.createTransport({
    service: smtpService,
    auth: {
        user: smtpUser,
        pass: smtpPassword
    }
});

export const sendMail = (to: string, subject: string, text: string) => {
    SMTPTransporter.sendMail({
        from: smtpUser,
        to,
        subject,
        text
    }, (err, _info) => {
        if (err) {
            throw new APIError(
                'Error sending email: ' + err.message,
                HTTPStatusCode.INTERNAL_SERVER_ERROR_500
            )
        }
    });
};


export default SMTPTransporter;