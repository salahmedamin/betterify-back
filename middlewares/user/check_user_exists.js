const { PrismaClient } = require("@prisma/client")
const extract_tag_from_text = require("./extract_tag_from_text")
const prisma = new PrismaClient()
module.exports = async(req,res,next)=>{
    const {content} = req.body
    //get usernames after @
    const persons_in_message = extract_tag_from_text({message: content})
    if(!Array.isArray(persons_in_message)) {
        req.taggedInMessage = []
        next()
    }
    else{
        let available = []
        for(p of persons_in_message){
            const isAvailable = await prisma.user.findFirst({
                where:{
                    username: p
                }
            })
            if(isAvailable) available.push({
                username: isAvailable.username,
                id: isAvailable.id
            })
        }
        req.taggedInMessage = available
        next()
    }
}