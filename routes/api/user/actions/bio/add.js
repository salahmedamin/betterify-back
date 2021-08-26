const bios = require("../../../../../controllers/bios")

module.exports = async(req,res)=>{
    try{
        const {
            sex,
            age,
            bio,
            userID
        } = req.body
        res.send(await bios.addBio({
            age,
            sex,
            bio,
            userID
        }))
    }
    catch(e){
        res.send({
            error:true,
            message: e.message
        })
    }
}