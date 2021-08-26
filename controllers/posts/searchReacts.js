const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = async ({
    postID,
    keyword,
    userID
}) => {
    const res = await prisma.$queryRaw`
    SELECT 
        u.username,
        reaction.emoji,
        u.firstName,
        u.lastName,
        u.profilePic,
        (CASE WHEN EXISTS(SELECT * FROM user_to_user_follows WHERE followerID = ${userID} AND followedID = u.id AND isPending = 0 AND isDeleted = 0) THEN 1 ELSE 0 END) youFollow,
        (CASE WHEN EXISTS(SELECT * FROM user_to_user_follows WHERE followedID = ${userID} AND followerID = u.id AND isPending = 0 AND isDeleted = 0) THEN 1 ELSE 0 END) followsYou
    FROM
        reaction,
        user u
    WHERE
        u.id != ${userID}
        AND
        u.id = reaction.reactorID
        AND
        u.username LIKE ${keyword+"%"}
        AND
        #no blocking 
        NOT EXISTS(
            SELECT 
            * 
            FROM 
            user_to_user_blockings ub 
            WHERE 
            (
                ub.blockerID = u.id 
                AND ub.blockedID = ${userID}
            ) 
            OR (
                ub.blockedID = u.id
                AND ub.blockerID = ${userID}
            )
        )
        AND
        #get reacts on post
        reaction.postID = ${postID}
        #post isn't deleted
        AND
        (SELECT isDeleted FROM post WHERE id = ${postID}) = 0
        AND
        (SELECT isDeletedBySystem FROM post WHERE id = ${postID}) = 0
    ORDER BY youFollow DESC, followsYou DESC
    LIMIT 0, 20
    `
    return res
}