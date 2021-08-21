const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ commentID, replierID, text }) => {
    const res = await prisma.comment.update({
        where: {
            id: commentID
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
                            activity: "comment_reply_add"
                        }
                    }
                }
            }
        }
    })
    return res ? true : false
}