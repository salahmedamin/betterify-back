const deepai = require("../deepAI")

module.exports = async(file)=>{
    try{
        return (await deepai(file,"facial-recognition"))
    }
    catch(e){
        return {
            error:true,
            message: e.message,
        }
    }
}