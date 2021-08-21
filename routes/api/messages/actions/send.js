const send = require("../../../../controllers/messages/send")

module.exports = async (req,res)=>{
    const {content, senderID, receiverID, groupID, replyToID,} = req.body
    res.send(await send({
        content,
        senderID,
        receiverID,
        isReply: replyToID !== undefined,
        replyToID,
        groupID,
        tagged: req.taggedInMessage
    }))
}