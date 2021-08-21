const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({messageID, deleterID}) => {
    const isMessageSender = await prisma.message.findFirst({
        where:{
            id: messageID,
            sender:{
                id: deleterID
            }
        }
    })
    return isMessageSender ? true : false
}