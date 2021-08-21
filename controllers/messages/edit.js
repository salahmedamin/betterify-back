const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = async ({
    messageID,
    text
}) => {
    return await prisma.message.update({
        where:{
            id: messageID
        },
        data:{
            edits:{
                create:{
                    text
                }
            },
            hasEdits: true
        }
    }) ? {success:true} : {error:true}
}