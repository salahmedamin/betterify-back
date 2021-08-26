const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({userID, index=0, keyword = undefined}) => {
    const res = await prisma.user.findMany({
        where:{
            blockedBy:{
                some:{
                    blocker:{
                        id: userID
                    },
                    blocked: keyword ? {
                        username:{
                            startsWith: keyword
                        }
                    }:undefined
                }
            },
        },
        select:{
            username: true,
            firstName: true,
            lastName: true,
            profilePic: true
        },
        take: 20,
        skip: 20 * index
    })
    return res ??
    {
        error: true
    }
}