const nodemailer = require("nodemailer");
const pug = require("pug");
const {convert}=require('html-to-text');
// new Email(user,url).send

module.exports = class Email {
  constructor(user, url) {
    this.t0 = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Shubh Mehta <shubhmehta837@gmail.com>`;
  }
  newTransport() {
    return nodemailer.createTransport({
      service: "smtp.mailtrap.io",
      port: "25",
      auth: {
        user: "40bcd382647ef7",
        pass: "0bdcb23376ee80",
      },
    });
  }
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: html,
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
 async sendWelcome() {
   await this.send("welcome", "Welcome to the Natours family");
  }
};

// const sendEmail=async options =>{
//     const transporter=nodemailer.createTransport({
//         service:'smtp.mailtrap.io',
//         port:'25',
//         auth:{
//             user:"40bcd382647ef7",
//             pass:"0bdcb23376ee80"
//         }
//     })

//     const mailOptions={
//         from:`Shubh <impostercrewfreedom@gmail.com>`,
//         to: options.email,
//         subject: options.subject,
//         text: options.message
//     }

//     await transporter.sendMail(mailOptions);

// }
// module.exports=sendEmail