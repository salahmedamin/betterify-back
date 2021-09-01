const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ userID, unfollowedID }) => {
    const theFollow = await prisma.user_to_user_follows.findFirst({
        where:{
            followed:{
                id: unfollowedID
            },
            follower:{
                id: userID
            },
            isDeleted: false
        },
        select:{
            id: true,
            follower:{
                select:{
                    activities:{
                        where:{
                            other_user: {
                                id: unfollowedID
                            },
                            user:{
                                id: userID
                            },
                            activity: "user_follow"
                        },
                        select:{
                            id: true
                        }
                    }
                }
            }
        }
    })
    if(!theFollow) return { error: true }
    const res = await prisma.user.update({
        where:{
            id: userID
        },
        data:{
            activities:{
                delete:{
                    id: theFollow?.follower?.activities[0]?.id
                },
            },
            follows:{
                delete:{
                    id: theFollow.id
                }
            }
        }
    })
    return res ? {
        success: true
    } : {
        error: true
    }
}