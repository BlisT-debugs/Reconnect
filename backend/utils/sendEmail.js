const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter (We will use Mailtrap for testing, but this works with Gmail/SendGrid)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
        port: process.env.EMAIL_PORT || 2525,
        auth: {
            user: process.env.EMAIL_USER || "your_mailtrap_user", 
            pass: process.env.EMAIL_PASS || "your_mailtrap_pass"  
        }
    });

    const message = {
        from: `${process.env.FROM_NAME || 'Alumni Portal'} <${process.env.FROM_EMAIL || 'noreply@alumniportal.com'}>`,
        to: options.email,
        subject: options.subject,
        html: options.html // Allows us to send pretty HTML emails
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;