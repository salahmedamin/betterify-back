const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ userID, followedID }) => {
    const res = await prisma.user.update({
        where:{
            id: userID
        },
        data:{
            follows:{
                connect:{
                    id: followedID
                }
            }
        }
    })
    return res ? true : false
}