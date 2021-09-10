const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const PORT = 5000

//add consider following user when watching video for more than 1 minute

const helmet = require("helmet")

app.use(helmet({
  frameguard: {
    action: "deny"
  },
  dnsPrefetchControl: {
    allow: true
  },
  hidePoweredBy: true,
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: {
    policy: ["origin", "unsafe-url"],
  },
  expectCt: {
    enforce: true,
    maxAge: 96400
  },
  xssFilter: true
}))

//importing router
const apiRouter = require("./routes/api")


app.use(cors({
  origin: ["*"],
  allowedHeaders: ["Content-Type", "*"]
}))
app.use(bodyParser({ extended: true }))
app.use(bodyParser.urlencoded())

app.use(express.json())

BigInt.prototype.toJSON = function () {
  return this.toString()
}

app.use(apiRouter)

app.listen(PORT, () => console.log(`Listening on ${PORT}`))