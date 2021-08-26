const { PrismaClient } = require("@prisma/client")
const formatPosts = require("./formatPosts")
const generateSelect = require("./generateSelect")
const prisma = new PrismaClient()
module.exports = async ({ postID, userID, index = 0 }) => {

  const res = await prisma.$queryRaw`
    SELECT 
  * 
FROM 
  (
    SELECT 
      id, 
      ownerID,
      isShared, 
      onlyFollowers, 
      onlyFollowersAndFollowed, 
      privacyType, 
      groupID,
      diff,
      isDeletedBySystem,
      isDeleted,
      (
        SELECT * 
        FROM _posts_already_seen 
        WHERE 
          A = ${postID}
          AND
          B = ${userID}
      ) isSeen
    FROM 
      (
        SELECT 
          * 
        FROM 
          post, 
          (
            SELECT 
              a.postID postID, 
              ABS(
                  AVG(a.score)
                  -
                  (
                      SELECT AVG(score) FROM tag WHERE 
                      postID = ${postID} 
                      AND 
                      hashtag IN (SELECT hashtag FROM tag WHERE postID = ${postID})
                  )
                ) diff 
            FROM 
              (
                SELECT 
                  postID, 
                  id, 
                  hashtag, 
                  score 
                FROM 
                  tag t1 
                WHERE 
                  postID = ${postID}
                UNION 
                SELECT 
                  t.postID, 
                  t.id, 
                  t.hashtag, 
                  t.score score 
                FROM 
                  tag t 
                WHERE 
                  t.hashtag IN (
                    SELECT 
                      hashtag 
                    FROM 
                      tag 
                    WHERE 
                      postID = ${postID}
                  )
              ) a 
            WHERE 
              a.postID != ${postID} 
            GROUP BY 
              a.postID
          ) calc 
        WHERE 
          post.id = calc.postID 
          AND post.isShared = 0 
        ORDER BY 
          calc.diff ASC
      ) a
  ) post 
WHERE 
  (
    post.groupID IS NULL
    OR
    (
      (SELECT isDeleted FROM groups WHERE id = post.groupID) = 0
      AND
      (
        (SELECT isPublic FROM groups WHERE id = post.groupID) = 1)
        OR
        EXISTS (
          SELECT * 
          FROM groups_join_requests 
          WHERE 
            memberID = ${userID} 
            AND
            groupID = post.groupID
            AND
            isPending = 0
            AND
            isDeleted = 0
        )
      )
    )
  )
  AND
  AND
  post.isDeleted = 0
  AND
  post.isDeletedBySystem = 0
  AND
  #only not excluded people
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
            uv.A = post.id #matching post
            AND uv.B = ${userID}
        )
      )
    ) ELSE (
      #PUBLIC
      (
        post.privacyType IS NULL 
        AND post.onlyFollowers = 0 
        AND post.onlyFollowersAndFollowed = 0
      ) #only followers can see
      OR (
        post.onlyFollowers = 1 
        AND EXISTS(
          SELECT 
            * 
          FROM 
            user_to_user_follows uf 
          WHERE 
            uf.followerID = ${userID} 
            AND uf.followedID = post.ownerID 
            AND uf.isPending = 0 
            AND uf.isDeleted = 0
        )
      ) #onyl people i follow or follow me
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
                uf.followerID = ${userID} 
                AND uf.followedID = post.ownerID
              ) 
              OR (
                uf.followerID = post.ownerID 
                AND uf.followedID = ${userID}
              )
            )
        )
      ) #only included people
      OR(
        post.privacyType = "include" 
        AND (
          EXISTS(
            SELECT 
              * 
            FROM 
              _users_visibility uv 
            WHERE 
              uv.A = post.id #matching post
              AND uv.B = ${userID}
          )
        )
      )
    ) 
    AND #NOT BLOCKER, NOR BLOCKED
    NOT EXISTS(
      SELECT 
        * 
      FROM 
        user_to_user_blockings ub 
      WHERE 
        (
          ub.blockerID = post.ownerID 
          AND ub.blockedID = ${userID}
        ) 
        OR (
          ub.blockedID = post.ownerID 
          AND ub.blockerID = ${userID}
        )
    ) END
    ORDER BY isSeen ASC
  )
  LIMIT ${index * 20},20
    `
  let all = []
  for (const r of res) {
    const post = await prisma.post.findFirst({
      where: {
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