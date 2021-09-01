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
const upload = require("../../multer")




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
//router.post("/markSeen", markSeen)



//get
router.post("/getPost", getPost)
router.post("/getPostMedia", getPostMedia)
router.post("/getComments", getComments)
router.post("/getReacts", getReacts)
router.post("/getFeedPosts", getFeedPosts)
router.post("/getProfilePosts", getProfilePosts)
router.post("/getSimilar", getSimilar)
router.post("/searchReacts", searchReacts)
//router.post("/getProfileSharedPosts", getProfileSharedPosts)

module.exports = router