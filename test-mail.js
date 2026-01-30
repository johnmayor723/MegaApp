var nodemailer = require('nodemailer');
var transport = nodemailer.createTransport({
    host: "smtp.zeptomail.com",
    port: 587,
    auth: {
    user: "emailapikey",
    pass: 
"wSsVR610qxD5WKkpn2f/Lro7mFhTDlqiHE5/3FD3un6uTPHCpcdqwhbOVlKuHvAaGTVrEzUToLl/kUgIhzJdhtguzAxTXSiF9mqRe1U4J3x17qnvhDzKW2tdlRKAJYgBwgxsmWBkE8wm+g=="
    }
});

var mailOptions = {
    from: '"Example Team" <noreply@easyhostnet.com>',
    to: 'mayowa.andrews@easyhostnet.com',
    subject: 'Test Email',
    html: 'Test email sent successfully.',
};

transport.sendMail(mailOptions, (error, info) => {
    if (error) {
    return console.log(error);
    }
    console.log('Successfully sent');
});
