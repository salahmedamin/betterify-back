const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = async ({
    postID,
    index = 0
}) => {
    return await prisma.edits.findMany({
        where:{
            post:{
                id: postID
            }
        },
        orderBy:{
            created_at: "desc"
        },
        take: 20,
        skip: index*20
    })
}