//actions
const create = require("./posts/actions/create")
const comment = require("./posts/actions/comment")
const _delete = require("./posts/actions/delete")
const editContent = require("./posts/actions/editContent")
const editPrivacy = require("./posts/actions/editPrivacy")
const send = require("./posts/actions/send")
const share = require("./posts/actions/share")
const react = require("./posts/actions/react")

//get
const getComments = require("./posts/get/comments")
const getPostMedia = require("./posts/get/postMedia")
const getFeedPosts = require("./posts/get/feedPosts")
const getProfilePosts = require("./posts/get/profilePosts")
const getReacts = require("./posts/get/reacts")
const searchReacts = require("./posts/get/searchReacts")
const getPost = require("./posts/get/post")
const getSimilar = require("./posts/get/similar")



//MULTER
const multer = require("multer")
const makeid = length=>{
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')   
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '_' + makeid(13)+"."+file.mimetype.split("/")[1])      
    }
})
const upload = multer({ storage: storage });
//MULTER




const router = require("express").Router()


//actions
router.post("/create", upload.array('file'), create)
router.post("/comment", upload.array('file'), comment)
router.post("/editContent", editContent)
router.post("/editPrivacy", editPrivacy)
router.post("/send", send)
router.post("/share", share)
router.post("/delete", _delete)
router.post("/react", react)



//get
router.post("/getPost", getPost)
router.post("/getPostMedia", getPostMedia)
router.post("/getComments", getComments)
router.post("/getReacts", getReacts)
router.post("/getFeedPosts", getFeedPosts)
router.post("/getProfilePosts", getProfilePosts)
router.post("/getSimilar", getSimilar)
router.post("/searchReacts", searchReacts)

module.exports = router