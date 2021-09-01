const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const PORT = 5000

//add consider following user when watching video for more than 1 minute

// const helmet = require("helmet")

// app.use(helmet({
//   frameguard: {
//     action: "deny"
//   },
//   dnsPrefetchControl: {
//     allow: true
//   },
//   hidePoweredBy: true,
//   ieNoOpen: true,
//   noSniff: true,
//   referrerPolicy: {
//     policy: ["origin", "unsafe-url"],
//   },
//   expectCt: {
//     enforce: true,
//     maxAge: 96400
//   },
//   xssFilter: true
// }))

//importing router
const apiRouter = require("./routes/api")
// const { PrismaClient } = require("@prisma/client")
const multer = require("./multer")
// const imgur = require("./controllers/multimedia/imgur")
// const FormData = require("form-data")
// const { default: got } = require("got/dist/source")
// const { default: axios } = require("axios")
const dtube = require("./controllers/multimedia/dtube")


app.use(cors({
  origin: ["*"],
  allowedHeaders: ["Content-Type", "*"]
}))
app.use(bodyParser({ extended: true }))
app.use(express.json())

BigInt.prototype.toJSON = function () {
  return this.toString()
}

app.post("/dtube", multer.single('files'), async (req, res) => {
  res.send(await dtube({
    file: req.file
  }))
})

// app.post("/xx", multer.single('file') , async(req, res) => {
//     const imgr = await imgur({
//       // image: req.file,
//       video: req.file
//     })
//     res.send(imgr)
// })

app.use(apiRouter)

// app.get("/notifType/", async (req, res) => {
//   try {
//     res.send(await add({
//       isReply: true,
//       groupID: true,
//       commentID: true,
//       my: true
//     }))
//   }
//   catch (e) {
//     res.send({
//       error: true,
//       message: e.message
//     })
//   }
// }
// )



// app.use("/images", express.static("images"))


// app.post("/enc/", multer.single('file'), async (req, res) => {
//   try {
//     const uploaded = await upload(req.file)
//     res.send(uploaded)
//   } catch (e) {
//     res.send({
//       message: e.message,
//       trace: e.stack
//     })
//   }
// })

// app.get("/post/:id/:user", async (req, res) => {
//   try {
//     const { id, user } = req.params
//     res.send(await getSinglePost({ postID: parseInt(id), userID: parseInt(user) }))

//     // res.send(await getSimilarTags({postID: parseInt(id),userID: parseInt(user)}))
//     // res.send(
//     //   await getReactions({
//     //     postID: parseInt(id)
//     //   })
//     // )
//   } catch (e) {
//     res.send({
//       message: e.message,
//       trace: e.stack
//     })
//   }
// })

// app.post("/messages/send",async(req,res,next)=>{
//   const canBeTagged = req.body.taggedPersons,
//   rez = []
//   for(const one of canBeTagged){
//     if(!req.body.groupID && !(await checkBlock()))
//   }
// },
// async(req,res)=>{
//   res.send(await send({
//     content:"ALOHA USA",
//     senderID: 1,
//     receiverID: 2,
//   }))
// })

app.listen(PORT, () => console.log(`Listening on ${PORT}`))