const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({blockerID,blockedID}) => {
    const res = await prisma.user.update({
        where:{
            id: blockerID
        },
        data: {
            blocked:{
                connect:{
                    id: blockedID
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
            follows:{
                delete:{
                    followerID_followedID:{
                        followedID: blockedID
                    }
                }
            }
        }
    })
    return res ? true : false
}