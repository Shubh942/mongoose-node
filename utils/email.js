const nodemailer=require('nodemailer');

const sendEmail=async options =>{
    const transporter=nodemailer.createTransport({
        service:'smtp.mailtrap.io',
        port:'25',
        auth:{
            user:"40bcd382647ef7",
            pass:"0bdcb23376ee80" 
        }
    })

    const mailOptions={
        from:`Shubh <impostercrewfreedom@gmail.com>`,
        to: options.email,
        subject: options.subject,
        text: options.messag
    }

    await transporter.sendMail(mailOptions);

}
module.exports=sendEmail