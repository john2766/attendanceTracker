const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'chan.ng.cashin@gmail.com',
        pass: 'yqna uzmx mtoh iscm',
    },
});

const mailDetails = {
    from: 'chan.ng.cashin@gmail.com',
    to: 'cngcashi@purdue.edu',
    subject: 'Test mail',
    text: 'Node.js testing mail for GeeksforGeeks'
};

transporter.sendMail(mailDetails, function (err, data) {
    if (err) {
        console.log('Error Occurs');
        console.error(err.message)
    } else {
        console.log('Email sent successfully');
    }
});