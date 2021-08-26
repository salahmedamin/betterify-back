const { PrismaClient } = require("@prisma/client");
const commentManager = require("../../middlewares/comments")

const prisma = new PrismaClient()
module.exports = async ({commentID,deleterID}) => {
    if(!(await commentManager.canDeleteComment(commentID,deleterID))){
        return {error: true}
    }
    else{
        const res = await prisma.comment.update({
            where:{
                id: commentID
            },
            data:{
                isDeleted: true
            }
        })
        return res ? {success:true} : {error: true}
    }
}