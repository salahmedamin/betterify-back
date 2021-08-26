const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ postID }) => {
    const data = await prisma.reaction.aggregate({
        where:{
            post:{
                id: postID,
                isDeleted: false,
                isDeletedBySystem: false
            }
        },
        max: {
            emoji: true,
        }
    })
    return data?.max?.emoji
}