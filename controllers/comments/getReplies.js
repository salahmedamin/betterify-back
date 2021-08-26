const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ commentID, index = 0 }) => {
    const res = await prisma.comment.findFirst({
        where:{
            id: commentID,
            isDeleted: false,
            isDeletedBySystem: false
        },
        include:{
            replies:{
                orderBy:{
                    created_at: "desc"
                },
            }
        },
        skip: index*15,
        take: 15
    })

    return res.replies
}