//actions
const create = require("./posts/actions/create")
const comment = require("./posts/actions/comment")
const _delete = require("./posts/actions/delete")
const editContent = require("./posts/actions/editContent")
const editPrivacy = require("./posts/actions/editPrivacy")
const send = require("./posts/actions/send")
const share = require("./posts/actions/share")
const react = require("./posts/actions/react")
const markSeen = require("./posts/actions/markSeen")

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
router.post("/edit/content", editContent)
router.post("/edit/privacy", editPrivacy)
router.post("/send", send)
router.post("/share", share)
router.post("/delete", _delete)
router.post("/react", react)
router.post("/markSeen", markSeen)



//get
router.post("/", getPost)
router.post("/postMedia", getPostMedia)
router.post("/comments", getComments)
router.post("/reacts", getReacts)
router.post("/feedPosts", getFeedPosts)
router.post("/profilePosts", getProfilePosts)
router.post("/similar", getSimilar)
router.post("/searchReacts", searchReacts)
//router.post("/getProfileSharedPosts", getProfileSharedPosts)

module.exports = router