const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ commentID, index = 0 }) => {
    const res = await prisma.reaction.findMany({
        where: {
            comment: {
                id: commentID,
                isDeleted: false,
                isDeletedBySystem: false
            }
        },
        orderBy:{
            created_at: "desc"
        },
        take:30,
        skip:index*30
    })
    return res
}