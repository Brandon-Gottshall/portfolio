export default function legacyOPWebHook (req, res) {
  console.log(req.body)
  res.status(200).end()
}
