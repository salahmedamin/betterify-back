const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({commentID, deleterID}) => {
    const isCommentWriter = await prisma.comment.findFirst({
        where:{
            id: commentID,
            writer:{
                id: deleterID
            }
        }
    })
    return isCommentWriter ? true : false
}