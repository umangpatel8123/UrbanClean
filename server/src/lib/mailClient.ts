import {
  createTestAccount,
  createTransport,
  getTestMessageUrl,
} from 'nodemailer';

const sendMail = async (subject: string, text: string, toEmail: string) => {
  createTestAccount((err, _account) => {
    if (err) {
      throw new Error(err.message);
    }
    const transporter = createTransport({
      auth: {
        pass: process.env['ETHEREAL_EMAIL_PASS'],
        user: process.env['ETHEREAL_EMAIL_USER'],
      },
      host: 'smtp.ethereal.email',
      port: 587,
    });

    const message = {
      from: process.env['ETHEREAL_EMAIL_USER'],
      html: `<p>${text}</p>`,
      subject: subject,
      text: text,
      to: toEmail,
    };

    transporter.sendMail(message, (err, info) => {
      if (err) {
        throw new Error(err.message);
      }
      console.log({'Preview URL': getTestMessageUrl(info)});
    });
  });
};

export default sendMail;
