const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.ACCOUNT_GMAIL}`,
    pass: `${process.env.ACCOUNT_PASSWORD}`,
  },
});

// async..await is not allowed in global scope, must use a wrapper
exports.sendGmail = async (toGmail, title, content) => {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Manhj 👻" <${process.env.ACCOUNT_GMAIL}>`, // sender address
    to: "testlabyo01@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "how?", // plain text body
    html: `<b>Hello world?</b>
        <h1>Testing</h1>
    `, // html body
  });
};
