const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ userID, unfollowedID }) => {
    const res = await prisma.user.update({
        where:{
            id: userID
        },
        data:{
            follows:{
                delete:{
                    id: unfollowedID
                }
            }
        }
    })
    return res ? true : false
}