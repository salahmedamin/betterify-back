const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ commentID, reactorID, emoji }) => {
    const res = await prisma.comment.update({
        where: {
            id: commentID,
            isDeleted: false,
            isDeletedBySystem: false
        },
        data: {
            reactions: {
                create: {
                    reactor: {
                        connect: {
                            id: reactorID
                        }
                    },
                    emoji,
                }
            },
            user_activity:{
                create:{
                    user:{
                        connect:{
                            id: reactorID
                        }
                    },
                    activity: "comment_react"
                }
            }
        }
    })
    return res ? true : false
}