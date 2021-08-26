const { rate } = require("../../../../../controllers/user/rating");

module.exports = async(req,res)=>{
    try{
        const {
            ratedID,
            raterID,
            rating,
            message
        } = req.body
        res.send(await rate({
            ratedID,
            raterID,
            rating,
            message
        }))
    }
    catch(e){
        return {
            error: true,
            message: e.message
        }
    }
}