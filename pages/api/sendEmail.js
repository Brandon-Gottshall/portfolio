// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import sgMail from '@sendgrid/mail'
export default function sendEmail (req, res) {
  console.log(req.body)
  const { email, phoneNumber, inquiry } = JSON.parse(req.body)
  console.log({ email, phoneNumber, inquiry })
  const message = {
    from: 'inquiry@brandongottshall.com',
    to: 'blgottshall@gmail.com',
    subject: 'Portfolio Inquiry',
    html: `<p>Email: ${email}</p><p>Number: ${phoneNumber}</p><p>Inquiry: ${inquiry}</p>`
  }
  console.log(message)
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  sgMail.send(message)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
      console.error(JSON.stringify(error.response.body, null, 2))
    })
  res.end()
}
