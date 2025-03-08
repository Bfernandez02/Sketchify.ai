import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, phone, email, subject, message } = req.body;






        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'sketchifyemails@gmail.com',
                pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD
            },
        });

        // Set up the email data
        const mailOptions = {
            from: 'sketchifyemails@gmail.com',
            to: 'sketchifyemails@gmail.com',
            subject: `${subject}`,
            html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
            replyTo: email,
        };

        try {

            await transporter.sendMail(mailOptions);


            res.status(200).json({ message: 'Message sent successfully!' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send message.' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}
