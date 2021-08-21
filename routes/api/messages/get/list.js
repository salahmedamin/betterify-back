const get = require("../../../../controllers/messages/get")

module.exports = async(req,res)=>{
    const {userID, groupID, index, otherID } = req.body
    res.send(
        await get({
          userID,
          groupID,
          index,
          otherID
        })
    )
}