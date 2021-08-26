const { PrismaClient } = require("@prisma/client")

//people that follow both of user 1 and user 2

const prisma = new PrismaClient()
module.exports = async ({ id1, id2 }) => {
    const res = await prisma.$queryRaw`
    SELECT COUNT(*) as total
    FROM user_to_user_follows f1
    WHERE 
        followerID != ${id2}
        AND
        followedID = ${id1}
        AND
        isPending = 0
        AND
        isDeleted = 0
        AND EXISTS(
            SELECT *
            FROM user_to_user_follows
            WHERE 
                followerID != ${id1}
                AND
                followedID = ${id2}
                AND
                isPending = 0
                AND
                isDeleted = 0
                AND
                followerID = f1.followerID
        )
    `
    return res[0]?.total ?? {
        error: true
    }
}