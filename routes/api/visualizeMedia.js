const makeLocal = require("../../controllers/multimedia/makeLocal")

module.exports = (req,res)=>{
    const {id} = req.params
    const {type} = req.query
    const link = type == "video" ?  `https://player.d.tube/ipfs/${id}` : `https://ipfs.infura.io/ipfs/${id}`
    makeLocal({link, res})
}