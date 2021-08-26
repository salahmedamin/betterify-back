const { PrismaClient } = require("@prisma/client");
const checkFollows = require("../user/follow/checkFollows");
const checkBlock = require("./checkBlock");

const prisma = new PrismaClient()
module.exports = async ({blockerID,blockedID}) => {
    if(await checkBlock({
        blockerID,
        blockedID,
        absolute: true
    })) return {
        error: true
    }

    const alreadyFollow = {
        blockerToBlocked: await checkFollows({
            followerID: blockerID,
            followedID: blockedID
        }),
        blockedToBlocker: await checkFollows({
            followerID: blockedID,
            followedID: blockerID
        }),
    }
    const res = await prisma.user.update({
        where:{
            id: blockerID
        },
        data: {
            blocked:{
                create:{
                    blocked: {
                        connect:{
                            id: blockedID
                        }
                    }
                }
            },
            activities:{
                create:{
                    activity: "user_block",
                    other_user:{
                        connect:{
                            id: blockedID
                        }
                    }
                }
            },
            follows: alreadyFollow.blockerToBlocked ? {
                delete:{
                    followerID_followedID:{
                        followedID: blockedID,
                        followerID: blockerID
                    }
                }
            } : undefined,
            followedBy:alreadyFollow.blockedToBlocker ? {
                delete:{
                    followerID_followedID:{
                        followerID: blockedID,
                        followedID: blockerID
                    }
                }
            } : undefined
        }
    })
    return res ? {
        success:true
    } 
    :
    {
        error: true
    }
}