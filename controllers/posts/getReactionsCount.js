const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({
    postID,
}) => {
    const res =
    (await prisma.reaction.groupBy({
        by: ["emoji"],
        where:{
            post:{
                id: postID
            }
        },
        _count: {
            _all: true
        }
    })).map(a=>({
        emoji: a?.emoji,
        total: a?._count._all
    }))
    return res
}