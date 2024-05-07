const sendEmail =require("../Utils/email");

exports.contactUs = async (req, res, next) => {
    try {
        const { name, email, message } = req.body;

        // Validate input fields
        if (!name || !email || !message) {
            return res.status(400).json({ status: 'error', message: 'Please provide name, email, and message.' });
        }

        // Construct email message
        const emailMessage = `
            Name: ${name}
            Email: ${email}
            
            Message:
            ${message}
        `;

        // Send email
        await sendEmail({
            email: 'affanzahir26@gmail.com', // Change this to your email address
            subject: 'Contact Us Form Submission',
            message: emailMessage
        });

        return res.status(200).json({ status: 'success', message: 'Message sent successfully.' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
};
