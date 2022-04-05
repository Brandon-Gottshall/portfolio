// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function sendEmail (req, res) {
  const sgMail = require('@sendgrid/mail')
  const { email, number, inquiry, apiKey } = req.body
  // sgMail.setApiKey(process.env.SENDGRID || apiKey)
  console.log({ email, number, inquiry })
  const message = {
    from: 'blgottshall@gmail.com',
    to: 'blgottshall@gmail.com',
    subject: 'Portfolio Inquiry',
    html: `<p>Email: ${email}</p><p>Number: ${number}</p><p>Inquiry: ${inquiry}</p>`
  }
  console.log(message)
  // sgMail.send(message)
  //   .then(() => {
  //     console.log('Email sent')
  //   })
  //   .catch((error) => {
  //     console.error(error)
  //     console.error(JSON.stringify(error.response.body, null, 2))
  //   })
  res.end(JSON.stringify({ test: 'test', email, number, inquiry, apiKeyReceivedInReq: Boolean(apiKey) }))
}
