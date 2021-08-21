const { PrismaClient } = require("@prisma/client");
const commentManager = require("../../middlewares/comments")

const prisma = new PrismaClient()
module.exports = async ({commentID,deleterID}) => {
    if(!(await commentManager.canDeleteComment(commentID,deleterID))){
        return false
    }
    else{
        const res = await prisma.comment.delete({
            where:{
                id: commentID
            }
        })
        return res ? true : false
    }
}