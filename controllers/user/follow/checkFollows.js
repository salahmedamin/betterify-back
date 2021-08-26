const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ followerID, followedID }) => {
    const data = await prisma.user_to_user_follows.findFirst({
        where:{
            followed:{
                id: followedID
            },
            follower:{
                id: followerID
            }
        }
    })
    
    return data ? 
    true
    :
    false
}