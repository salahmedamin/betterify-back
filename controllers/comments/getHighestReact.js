const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ commentID }) => {
    const data = await prisma.reaction.aggregate({
        where:{
            comment:{
                id: commentID,
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