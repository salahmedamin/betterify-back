const hobbies = require("../../../../../controllers/hobbies")

module.exports = async(req,res)=>{
    try{
        const {keyword, index = 0} = req.body
        res.send(await hobbies.search({
            keyword,
            index
        }))
    }
    catch(e){
        res.send({
            error:true,
            message: e.message
        })
    }
}