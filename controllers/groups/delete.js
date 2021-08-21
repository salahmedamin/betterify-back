const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ unique, userID, isChatGroup = false }) => {
    const res = await prisma.user.update({
        where: {
            id: userID,
        },
        data:{
            created_groups:{
                delete:{
                    unique
                }
            },
            activities:{
                create:{
                    activity: isChatGroup ? "group_chat_delete" : "group_delete",
                    group:{
                        connect:{
                            unique
                        }
                    },
                }
            }
        }
    })
    return res || {error:true}
}