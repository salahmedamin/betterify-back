const checkVisible = require("../../controllers/posts/checkVisible")

const router = require("express").Router()

router.post("/check", async(req,res)=>{
    const {postID, userID} = req.body
    res.send(await checkVisible({
        postID,
        userID
    }))
})
router.post("/create",()=>true)
router.post("/getPost/",()=>true)

module.exports = router