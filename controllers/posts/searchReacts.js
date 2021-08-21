const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = async ({
    messageID,
    keyword
}) => {
    if(keyword.length<3) return {error:true}
    return await prisma.reaction.findMany({
        where:{
            message:{
                id: messageID
            },
            reactor:{
                username: {
                    startsWith: keyword
                }
            }
        },
        take: 20
    })
}