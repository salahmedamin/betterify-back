const { PrismaClient } = require("@prisma/client");
const commentManager = require("../../middlewares/comments")

const prisma = new PrismaClient()
module.exports = async ({commentID,text}) => {
    const isEditable = await commentManager.isEditable(commentID)
    if(!isEditable){
        return false
    }
    else{
        const res = await prisma.comment.update({
            where:{
                id: commentID
            },
            data:{
                edits:{
                    create:{
                        text
                    }
                },
                user_activity:{
                    create:{
                        user:{
                            connect:{
                                id: isEditable.owner
                            }
                        },
                        activity: "comment_edit"
                    }
                }
            }
        })
        return res
    }
}