const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = async ({
    messageID,
    index = 0
}) => {
    return await prisma.message.findMany({
        where:{
            replyToID:{
                id: messageID
            }
        },
        take: 20,
        skip: index*20
    })
}