const ipfs = require("../../../../../controllers/multimedia/ipfs")
const edit = require("../../../../../controllers/user/edit")

module.exports = async(req,res)=>{
    try{
        const picture = await ipfs({file: req.file})
        if(!picture) throw new Error("Missing needed parameters")
        res.send(await edit({
            userID,
            picture
        }))
    }
    catch(e){
        res.send({
            error:true,
            message: e.message
        })
    }
}