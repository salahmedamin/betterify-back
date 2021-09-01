const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ userID, index=0, orderBy = 'time', order = 'desc', keyword = undefined, selectAll = false }) => {
    const data = await prisma.user.findMany({
        where:{
            follows:{
                some:{
                    followed:{
                        id: userID
                    },
                    follower: !selectAll ? (keyword ? {
                        username:{
                            startsWith: keyword
                        }
                    } : undefined) : undefined
                }
            }
        },
        select:{
            id: true,
            username: !selectAll,
            profilePic: !selectAll,
            firstName: !selectAll,
            lastName: !selectAll,
        },
        orderBy: !selectAll ? (!keyword ? {
            username: orderBy == 'username' ? order : undefined,
            created_at: orderBy == 'time' ? order : undefined,
        } : undefined) : undefined,
        skip: !selectAll ? (index * 40) : undefined,
        take: !selectAll ? 40 : undefined
    })
    
    return data ??  {
        error: true
    }
}