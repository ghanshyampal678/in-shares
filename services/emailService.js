const nodemailer=require('nodemailer');

async function sendmail({from,to,subject,text,html}){
      let transport=nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure:false,
        auth:{
              user:process.env.MAIL_USER,
              pass:process.env.MAIL_PASS
        }
      });

      let info=await transport.sendMail({
            from:`inshare <${from}>`,
            to,
            subject,
            text,
            html
      })
}

module.exports=sendmail;
