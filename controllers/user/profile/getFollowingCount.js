const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ username }) => {
    const res = await prisma.user_to_user_follows.aggregate({
        where:{
            follower:{
                username,
            },
            isDeleted: false,
            isPending: false
        },
        _count:{
            _all: true
        }
    })
    return res._count._all ?? {
        error: true
    }
}