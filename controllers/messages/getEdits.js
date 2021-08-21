const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = async ({
    messageID,
    index = 0
}) => {
    return await prisma.edits.findMany({
        where:{
            message:{
                id: messageID
            }
        },
        orderBy:{
            created_at: "desc"
        },
        take: 20,
        skip: index*20
    })
}