const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ muterID, chatID }) => {

    const res = await prisma.muting.delete({
        where:{
            muterID_chatID:{
                chatID,
                muterID
            }
        }
    })

    return res ? {success:true} : {error:true}
}