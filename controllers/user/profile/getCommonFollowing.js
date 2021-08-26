const { PrismaClient } = require("@prisma/client")

//people that are followed by both of user 1 and user 2

const prisma = new PrismaClient()
module.exports = async ({ id1, id2 }) => {
    const res = await prisma.$queryRaw`
    SELECT COUNT(*) as total
    FROM user_to_user_follows f1
    WHERE
        followedID != ${id2}
        AND 
        followerID = ${id1}
        AND
        isPending = 0
        AND
        isDeleted = 0
        AND EXISTS(
            SELECT *
            FROM user_to_user_follows
            WHERE
                followedID != ${id1}
                AND 
                followerID = ${id2}
                AND
                isPending = 0
                AND
                isDeleted = 0
                AND
                followedID = f1.followedID
        )
    `
    return res[0]?.total ?? {
        error: true
    }
}