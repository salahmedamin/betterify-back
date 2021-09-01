const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ commentID, replierID, text }) => {
    const res = await prisma.comment.update({
        where: {
            id: commentID,
            isDeleted: false,
            isDeletedBySystem: false
        },
        data: {
            replies:{
                create:{
                    content: text,
                    writer:{
                        connect:{
                            id: replierID
                        }
                    },
                    user_activity:{
                        create:{
                            user:{
                                id: replierID
                            },
                            activity: "comment_reply"
                        }
                    }
                }
            }
        },
        include: {
            multimedia:true,
            personsTagged: {
                select:{
                    tagged:{
                        select:{
                            username:true
                        }
                    }
                }
            },
            reactions:{
                where:{
                    reactor:{
                        id: userID
                    }
                },
                select:{
                    emoji: true,
                    id: true,
                }
            },
            edits:{
                take: 1
            }
        },
    })
    return res
}