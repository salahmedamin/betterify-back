const { PrismaClient, Prisma } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({
    userID,
    postID,
    keyword,
    groupID = undefined /* group if you're tagging a user in it */,
    notIn = []
}) => {
    //conditions
    // the tagged must have a comment related to post
    // the tagger and tagged must not have blocking in between
    // if in group, the tagged MUST be a member
    // cannot tag same person twice or more in one post => check notIn
    // ORDER BY how many comments a user has done
    const res = await prisma.$queryRaw`
        SELECT 
            u.username, u.firstName, u.lastName, u.profilePic,
            (SELECT COUNT(*) FROM comment WHERE userID = ${userID} AND postID = ${postID}) commentsCount,
            (CASE WHEN EXISTS(SELECT * FROM user_to_user_follows WHERE followerID = ${userID} AND followedID = u.id AND isPending = 0 AND isDeleted = 0) THEN 1 ELSE 0 END) youFollow,
            (CASE WHEN EXISTS(SELECT * FROM user_to_user_follows WHERE followedID = ${userID} AND followerID = u.id AND isPending = 0 AND isDeleted = 0) THEN 1 ELSE 0 END) followsYou,
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
            ${groupID ? `
                    AND
                    #if in group, both must be members
                    EXISTS(
                        SELECT * FROM groups_join_requests
                        WHERE
                            (SELECT isChatGroup FROM groups WHERE id = ${groupID}) = 0
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
                `
            :
            ""
            }
            ORDER BY youFollow DESC, commentsCount DESC, followsYou DESC, u.username ASC
            LIMIT 0, 20
    `
    return res
}