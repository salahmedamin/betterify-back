const edit = require("../../../../../controllers/user/edit")

module.exports = async(req,res)=>{
    try{
        const {currentLocation,  originLocation} = req.body
        if(!(currentLocation||originLocation)) throw new Error("Missing needed parameters")
        res.send(await edit({
            userID,
            currentLocation,
            originLocation
        }))
    }
    catch(e){
        res.send({
            error:true,
            message: e.message
        })
    }
}