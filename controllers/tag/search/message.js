const { PrismaClient, Prisma } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({
    userID,
    keyword,
    groupID /* group if you're tagging a user in it */,
    notIn = []
}) => {
    if(!(groupID&&userID&&keyword)) return {error: true}
    //conditions
    // the tag MUST be in group
    // the tagger and tagged must not have blocking in between
    // if in group, the tagged MUST be a member
    // cannot tag same person twice or more in one post => check notIn
    const res = await prisma.$queryRaw`
        SELECT u.username, u.firstName, u.lastName, u.profilePic
        FROM
            user u
        WHERE
            u.id != ${userID}
            AND
            u.username LIKE '${keyword}%'
            AND
            u.username NOT IN (${Prisma.join(notIn)})
            AND
            #tagger and tagged must not have blocking in between
            NOT EXISTS(
                SELECT * FROM user_to_user_blockings
                WHERE (
                    blockerID = ${userID}
                    AND
                    blockedID = u.id
                )
                OR
                (
                    blockedID = ${userID}
                    AND
                    blockerID = u.id
                )
            )
            AND
            #both must be members of same group
            EXISTS(
                SELECT * FROM groups_join_requests
                WHERE
                    (SELECT isChatGroup FROM groups WHERE id = ${groupID}) = 1
                    AND
                    groupID = ${groupID}
                    AND
                    memberID = ${userID}
                    AND
                    isPending = 0
                    AND
                    isDeleted = 0
                    AND 
                    EXISTS(
                        SELECT * FROM groups_join_requests
                        WHERE
                            groupID = ${groupID}
                            AND
                            memberID = u.id
                            AND
                            isPending = 0
                            AND
                            isDeleted = 0
                    )
            )
            LIMIT 0, 30
    `
    return res
}