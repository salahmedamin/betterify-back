const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ userID, index=0, orderBy = 'time', order = 'desc', keyword = undefined }) => {
    const data = await prisma.user.findMany({
        where:{
            followedBy:{
                some:{
                    follower:{
                        id: userID
                    },
                    followed: keyword ? {
                        username:{
                            startsWith: keyword
                        }
                    } : undefined
                }
            }
        },
        select:{
            id: true,
            username: true,
            profilePic: true,
            firstName: true,
            lastName: true,
        },
        orderBy: !keyword ? {
            username: orderBy == 'username' ? order : undefined,
            created_at: orderBy == 'time' ? order : undefined,
        } : undefined,
        skip: index * 40,
        take: 40
    })
    
    return data ??  {
        error: true
    }
}