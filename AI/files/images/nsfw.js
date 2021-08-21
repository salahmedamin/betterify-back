const deepai = require("../deepAI")

module.exports = async(file)=>{
    try{
        return (await deepai(file,"nsfw-detector"))
    }
    catch(e){
        res.send({
            error:true,
            message: e.message,
        })
    }
}