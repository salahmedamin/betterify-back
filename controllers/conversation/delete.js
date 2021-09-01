const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ userID, groupID = undefined, otherID = undefined }) => {
    const chatID = (await prisma.chat_list.findFirst({
        where:{
            owner:{
                id: userID
            },
            group:{
                id: groupID
            },
            other:{
                id: otherID
            }
        }
    })).id

    const res = await prisma.chat_list.update({
        where:{
            id: chatID
        },
        data:{
            messages:{
                updateMany:{
                    where:{
                        isDeleted: false
                    },
                    data:{
                        isDeleted: true
                    }
                },
                set: []
            }
        }
    })
    &&
    await prisma.chat_list.delete({
        where:{
            id: chatID
        }
    })

    return res ? {success:true} : {error:true}
}