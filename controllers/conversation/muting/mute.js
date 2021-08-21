const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ muterID, chatID }) => {

    const res = await prisma.muting.create({
        data:{
            chat_list:{
                connect:{
                    id: chatID
                }
            },
            muter:{
                connect:{
                    id: muterID
                }
            }
        }
    })

    return res ? {success:true} : {error:true}
}