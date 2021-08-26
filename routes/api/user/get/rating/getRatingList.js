const rating = require("../../../../../controllers/user/rating");

module.exports = async(req,res)=>{
    try{
        const {
            ratedID,
            index,
            rate
        } = req.body
        res.send(await rating.getRatings({
            ratedID,
            index,
            rate
        }))
    }
    catch(e){
        return {
            error: true,
            message: e.message
        }
    }
}