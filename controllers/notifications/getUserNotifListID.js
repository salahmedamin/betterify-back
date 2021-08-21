const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ userID }) => {
    const res = await prisma.notification_list.findFirst({
        where:{
            user:{
                id: userID
            }
        }
    })
    return res.id
}