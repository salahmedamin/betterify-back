const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ userID, index = 0, order = "desc", keyword = undefined }) => {
    const data = await prisma.user_to_user_follows.findMany({
        where:{
            followed:{
                id: userID
            },
            follower: keyword ? {
                username:{
                    startsWith: keyword
                }
            } : undefined,
            isPending: true,
            isDeleted: false, 
        },
        select:{
            created_at: true,
            follower:{
                select:{
                    username: true,
                    profilePic: true,
                    firstName: true,
                    lastName: true
                }
            },
            id: true,
        },
        orderBy:{
            created_at: order
        },
        skip: index * 20,
        take: 20
    })
    
    return data ??  {
        error: true
    }
}