const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ groupID, userID, isChatGroup = false }) => {
    const res = await prisma.user.update({
        where: {
            id: userID,
        },
        data:{
            created_groups:{
                update:{
                    where:{
                        id: groupID
                    },
                    data:{
                        isDeleted: true
                    }
                }
            },
            activities:{
                create:{
                    activity: isChatGroup ? "group_chat_delete" : "group_delete",
                    group:{
                        connect:{
                            id: groupID
                        }
                    },
                }
            }
        }
    })
    return res || {error:true}
}