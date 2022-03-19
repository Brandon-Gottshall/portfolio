// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function sendEmail (req, res) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const { email, number, inquiry } = req.body
  console.log({ email, number, inquiry })
  const message = {
    from: 'me+portfolio@brandongottshall.com',
    to: 'blgottshall@gmail.com',
    subject: 'Portfolio Inquiry',
    html: `<p>Email: ${email}</p><p>Number: ${number}</p><p>Inquiry: ${inquiry}</p>`
  }
  console.log(message)
  res.end(JSON.stringify({ test: 'test', email, number, inquiry }))
}
