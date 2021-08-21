// const { default: got } = require("got")
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const app = express()
const helmet = require("helmet")

// const get = require("./controllers/messages/get")
// const getReplies = require("./controllers/messages/getReplies")
const PORT = 5000
const _multer = require("multer")
const storage = _multer.diskStorage({ // notice you are calling the multer.diskStorage() method here, not multer()
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});
const multer = _multer({ storage })

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
const makeLocal = require("./controllers/multimedia/makeLocal")
const upload = require("./controllers/multimedia/upload")
const add = require("./controllers/notifications/add")
const getSimilarTags = require("./controllers/posts/getSimilarTags")
const getSinglePost = require("./controllers/posts/getSinglePost")
const getReactions = require("./controllers/posts/getReactionsCount")
const get_image_tags = require("./AI/files/images/image_tags/get_image_tags")
const facial_recognition = require("./AI/files/images/facial_recognition")
const nsfw = require("./AI/files/images/nsfw")
const free = require("./AI/files/images/image_tags/free")
const process_media = require("./controllers/posts/media/process_media")
const create = require("./controllers/posts/create")
const send = require("./controllers/messages/send")
const checkBlock = require("./controllers/blocking/checkBlock")
// const getChatList = require("./controllers/conversation/getChatList")
// const save = require("./functions/files/save")

app.use(cors({
  origin: ["*"],
  allowedHeaders: ["Content-Type", "*"]
}))
app.use(bodyParser({ extended: true }))
app.use(express.json())

BigInt.prototype.toJSON = function () {
  return this.toString()
}
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

// app.get("/simTags", async (req, res) =>
//   res.send([
//     ...await getSimilarTags({ postID: 1 })
//   ])
// )

// app.use("/images", express.static("images"))

// app.use("/api", apiRouter)

// app.post("/imagga/", async (req, res) => {
//   try {
//     res.send(await free(req.body.link, true))
//   }
//   catch (e) {
//     res.send({
//       error: true,
//       stack: e.stack
//     })
//   }
// }
// )

// app.post("/posts/create", multer.array('file'), async (req, res) => {
//   try {
//     res.send({
//       ...await create(
//         {
//           userID: 1,
//           content: "Normally everything ok ! http://www.google.com",
//           files: req.files,
//           _with: [{ username: "chaali" }],
//           isCommentable: false,
//           isShareable: false,
//           activity: {
//             name: "Hiking",
//             complimentary: {
//               name: "Huskey",
//               thumbnail: "xx"
//             }
//           },
//           place: {
//             name: "Ariana"
//           },
//         }
//       )
//     })
//   }
//   catch (e) {
//     res.send({
//       error: true,
//       stack: e.stack
//     })
//   }
// }
// )


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