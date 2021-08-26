const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ followID }) => {
    
    const followed = await prisma.user_to_user_follows.findFirst({
        where: {
            id: followID
        },
        select:{
            followed:{
                select:{
                    id: true
                }
            }
        }
    })

    const res = await prisma.user_to_user_follows.update({
        where:{
            id: followID
        },
        data:{
            isDeleted: false,
            isPending: false,
            follower:{
                update:{
                    activities:{
                        create:{
                            activity:"user_follow",
                            other_user:{
                                connect:{
                                    id: followed.followed.id
                                }
                            }
                        }
                    }
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