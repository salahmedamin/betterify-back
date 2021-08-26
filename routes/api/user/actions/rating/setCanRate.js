const { switchRate } = require("../../../../../controllers/user/rating");

module.exports = async(req,res)=>{
    try{
        const {
            userID,
            canBeRated
        } = req.body
        res.send(await switchRate({
            canBeRated,
            userID
        }))
    }
    catch(e){
        return {
            error: true,
            message: e.message
        }
    }
}