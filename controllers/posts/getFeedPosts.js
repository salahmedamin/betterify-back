const { PrismaClient } = require("@prisma/client")
const formatPosts = require("./formatPosts")
const generateSelect = require("./generateSelect")
const prisma = new PrismaClient()
module.exports = async ({ userID, index = 0 }) => {
    
    const res = await prisma.$queryRaw`
    SELECT 
      id, 
  	  ownerID,
      isShared, 
      onlyFollowers, 
      onlyFollowersAndFollowed, 
      privacyType, 
      groupID,
      (CASE WHEN EXISTS(
          SELECT *
          FROM posts_already_seen 
          WHERE 
          postID = post.id
          AND
          userID = 3
      ) THEN 1 ELSE 0 END) alreadySeen
FROM 
  post
WHERE
    post.isDeleted = 0
    AND
    post.ownerID != 3
    AND
    post.isDeletedBySystem = 0
    AND
  (
      CASE WHEN post.privacyType = "exclude" THEN (
          post.privacyType = "exclude" 
          AND (
              NOT EXISTS(
                  SELECT 
                  * 
                  FROM 
                  _users_visibility uv 
                  WHERE 
                  uv.A = post.id
                  AND uv.B = 3
              )
          )
      ) ELSE (

          (
              post.privacyType IS NULL 
              AND post.onlyFollowers = 0 
              AND post.onlyFollowersAndFollowed = 0
          )
          OR (
              post.onlyFollowers = 1 
              AND EXISTS(
                  SELECT 
                  * 
                  FROM 
                  user_to_user_follows uf 
                  WHERE 
                  uf.followerID = 3 
                  AND uf.followedID = post.ownerID 
                  AND uf.isPending = 0 
                  AND uf.isDeleted = 0
              )
          )
          OR (
              post.onlyFollowersAndFollowed = 1 
              AND EXISTS(
                  SELECT 
                  * 
                  FROM 
                  user_to_user_follows uf 
                  WHERE 
                  uf.isPending = 0 
                  AND uf.isDeleted = 0 
                  AND (
                      (
                          uf.followerID = 3
                          AND uf.followedID = post.ownerID
                      ) 
                      OR (
                          uf.followerID = post.ownerID 
                          AND uf.followedID = 3
                      )
                  )
              )
          )
          OR(
              post.privacyType = "include" 
              AND (
                  EXISTS(
                      SELECT 
                      * 
                      FROM 
                      _users_visibility uv 
                      WHERE 
                      uv.A = post.id
                      AND uv.B = 3
                  )
              )
          )
      ) END )
      AND
      NOT EXISTS(
          SELECT 
          * 
          FROM 
          user_to_user_blockings ub 
          WHERE 
          (
              ub.blockerID = post.ownerID 
              AND ub.blockedID = 3
          ) 
          OR (
              ub.blockedID = post.ownerID 
              AND ub.blockerID = 3
          )
      )
      AND
      (
          post.groupID IS NULL
          OR
          (
              EXISTS (
                  SELECT * 
                  FROM groups_join_requests
                  WHERE 
                  memberID = 3
                  AND
                  groupID = post.groupID
                  AND
                  isPending = 0
                  AND
                  isDeleted = 0
              )
		  )
      )
      ORDER BY alreadySeen ASC
      LIMIT ${index*20},20
    `
    let all = []
    for(const r of res){
        const post = await prisma.post.findFirst({
            where:{
                id: r.id
            },
            select:{
              ...generateSelect({viewerID: userID})
            }
        })
        const data = {
            ...r,
            ...post,
            activityID: undefined,
            placeID: undefined,
            groupID: undefined
        }
        all = [
            ...all,
            data
        ]
    }
    return await formatPosts({postsArray: all})
}