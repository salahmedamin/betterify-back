const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = async ({
    messageID,
    reactorID,
    emoji
}) => {
    const alreadyReacted = await prisma.reaction.findFirst({
        where:{
            message:{
                id: messageID
            },
            reactor:{
                id: reactorID
            }
        }
    })
    const res = alreadyReacted && alreadyReacted.emoji !== emoji ? 
        await prisma.reaction.update({
            where:{
                id: alreadyReacted.id
            },
            data:{
                emoji
            }
        })
    :
        alreadyReacted && alreadyReacted.emoji == emoji ?
        await prisma.reaction.delete({
            where:{
                id: alreadyReacted.id
            }
        })
    : 
        await prisma.reaction.create({
            where:{
                id: alreadyReacted.id
            },
            data:{
                emoji,
                message:{
                    connect:{
                        id: messageID
                    }
                }
            }
        })
    return res ? {success:true} : {error:true}
}