// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function sendEmail (req, res) {
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID)
  const { email, number, inquiry } = req.body
  console.log({ email, number, inquiry })
  const message = {
    from: 'me+portfolio@brandongottshall.com',
    to: 'blgottshall@gmail.com',
    subject: 'Portfolio Inquiry',
    html: `<p>Email: ${email}</p><p>Number: ${number}</p><p>Inquiry: ${inquiry}</p>`
  }
  console.log(message)
  sgMail.send(message).send(message)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
  res.end(JSON.stringify({ test: 'test', email, number, inquiry }))
}
