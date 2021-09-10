const { PrismaClient, Prisma } = require("@prisma/client");
const getHighestReact = require("../comments/getHighestReact");

/*create a new SQL command to be able to sort using 
    "newest", 
    "most replied to", 
    (
        "most reacted to"
        and if this selected
        "most emojis"
    )
*/

/*
    ability to search in comments
    
*/

module.exports = async ({
  postID,
  userID,
  replyToID = undefined,
  orderBy = undefined, //replies, reactions, date
  order = undefined, //asc desc
  index = 0,
}) => {
  try {
    const prisma = new PrismaClient();
    const inGroup = await prisma.groups.findFirst({
      where: {
        posts: {
          some: {
            id: postID,
          },
        },
      },
    });

    if (inGroup) {
      //check if member and group not deleted
      const done = await prisma.groups.findFirst({
        where: {
          id: inGroup.id,
          isChatGroup: false,
          isDeleted: false,
          OR: [
            {
              isPublic: true,
            },
            {
              isPublic: false,
              members: {
                some: {
                  member: {
                    id: userID,
                  },
                },
              },
            },
          ],
        },
      });
      if (!done) {
        throw new Error(
          "You don't have permission or this group has been deleted"
        );
      }
    }

    const res = await prisma.$queryRaw`
        SELECT
            c.id
            ${
              orderBy == "reactions"
                ? Prisma.sql`,( SELECT COUNT(*) count FROM reaction WHERE commentID = c.id ) order_by`
                : orderBy == "replies"
                ? Prisma.sql`,( SELECT COUNT(*) count FROM comment WHERE replyToID = c.id ) order_by`
                : Prisma.sql`,c.created_at order_by`
            }
        FROM
            post p,
            comment c,
            user u
        WHERE
            p.id = ${postID}
            ${replyToID ? Prisma.sql`AND c.replyToID = ${replyToID}` : Prisma.empty}
            AND
            p.id = c.postID
            AND
            p.isDeleted = 0
            AND
            p.isDeletedBySystem = 0
            AND NOT EXISTS(
              SELECT * FROM user_to_user_blockings
              WHERE blockerID = c.userID AND blockedID = ${userID}
            )
            AND NOT EXISTS(
                SELECT * FROM user_to_user_blockings
                WHERE blockedID = c.userID AND blockerID = ${userID}
            )
            AND
            c.isDeleted = 0
            AND
            c.isDeletedBySystem = 0
            GROUP BY c.id
            ${
              order.toLowerCase() == "asc"
                ? Prisma.sql`ORDER BY order_by ASC`
                : Prisma.sql`ORDER BY order_by DESC`
            }
            LIMIT ${index * 10},10
    `;

    //fetching ids
    let all = [];
    for (const one of res) {
      const oneComm = await prisma.comment.findFirst({
        where: {
          id: one?.id,
        },
        include: {
          multimedia: {
            select: {
              doubtedContent: {
                select: {
                  type: true,
                },
              },
              duration: true,
              reactions: {
                select: {
                  emoji: true,
                  reactor: {
                    select: {
                      username: true,
                    },
                  },
                },
              },
              unique: true,
              video_qualities: {
                select: {
                  quality: true,
                  videoHash: true,
                },
              },
              type: true,
            },
          },
          personsTagged: {
            select: {
              tagged: {
                select: {
                  username: true,
                },
              },
            },
          },
          reactions: {
            where: {
              reactor: {
                id: userID,
              },
            },
            select: {
              emoji: true,
              id: true,
            },
          },
          edits: {
            take: 1,
          },
        },
      });
      all = [
        ...all,
        {
          ...oneComm,
          highestReact: await getHighestReact(one.id),
          tagged: oneComm.personsTagged?.tagged?.map((e) => e.username),
          isEdited: oneComm.edits?.length > 0,
          personsTagged: undefined,
          currentReact: oneComm.reactions,
          reactions: undefined
        },
      ];
    }
    return all
  } catch (e) {
    return {
      error: true,
      message: e.message,
    };
  }
};
