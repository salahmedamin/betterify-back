const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ commentID, order = "desc", index = 0 }) => {
    const res = await prisma.reaction.findMany({
        where: {
            comment: {
                id: commentID
            }
        },
        orderBy:{
            created_at: order
        },
        take:30,
        skip:index*30
    })
    return res||false
}