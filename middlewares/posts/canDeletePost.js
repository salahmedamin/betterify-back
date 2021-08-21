const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({postID, deleterID}) => {
    const isPostWriter = await prisma.post.findFirst({
        where:{
            id: postID,
            owner:{
                id: deleterID
            }
        }
    })
    return isPostWriter ? true : false
}