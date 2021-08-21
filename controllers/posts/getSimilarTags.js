const { PrismaClient } = require("@prisma/client")
const getPostHighestReact = require("./getPostHighestReact")
const getReactionsCount = require("./getReactionsCount")
const getUserReactOnPost = require("./getUserReactOnPost")
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
      diff 
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
  post.groupID IS NULL
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
    AND #NOT BLOCKED, NOR BLOCKED
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
  )
  LIMIT ${index*20},20
    `
    let all = []
    for(const r of res){
        const post = await prisma.post.findFirst({
            where:{
                id: r.id
            },
            include:{
                multimedia:{
                    select:{
                        type: true,
                        unique: true,
                        faces:{
                            select:{
                                height:true,
                                width: true,
                                left: true,
                                top: true,
                                person:{
                                    select: {
                                        username: true
                                    }
                                }
                            }
                        }
                    }
                },
                activities:{
                    select:{
                        actName: {
                            select:{
                                name: true,
                                thumbnail: true,
                                complimentary_relation:{
                                    select: {
                                        complimentary: true
                                    }
                                }
                            }
                        },
                        with: {
                            select:{
                                username: true
                            }
                        }
                    }
                },
                place:{
                    select:{
                        name: true
                    }
                },
                owner:{
                  select:{
                    username: true,
                    firstName: true,
                    lastName: true,
                    profilePic: true
                  }
                }
            }
        })
        const data = {
            ...r,
            ...post,
            activities: undefined,
            activity:{
                name: res.activities?.actName,
                with: res.activities?.with
            },
            place:res.place?.name,
            multimedia: post.multimedia?.map(a=>({
                ...a,
                faces:a.faces.map(e=>({
                    ...e,
                    username: e.person?.username,
                    person: undefined
                }))
            })) ,
            react: {
              max: await getPostHighestReact({postID: r.id}),
              user: await getUserReactOnPost({postID: r.id, userID}),
              types: await getReactionsCount({postID:r.id})
            },
            activityID: undefined,
            placeID: undefined,
            groupID: undefined
        }
        all = [
            ...all,
            data
        ]
    }
    return all
}