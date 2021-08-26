const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = async ({
    postID,
    index = 0
}) => {
    return await prisma.edits.findMany({
        where:{
            post:{
                id: postID,
                isDeleted: false,
                isDeletedBySystem: false
            }
        },
        orderBy:{
            created_at: "desc"
        },
        take: 20,
        skip: index*20
    })
}