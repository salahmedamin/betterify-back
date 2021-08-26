const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({blockerID,blockedID}) => {
    const res = await prisma.user.update({
        where:{
            id: blockerID
        },
        data:{
            blocked:{
                delete:{
                    blockerID_blockedID:{
                        blockedID,
                        blockerID
                    }
                }
            },
            activities:{
                create:{
                    activity:"user_unblock",
                    other_user:{
                        connect:{
                            id: blockerID
                        }
                    }
                }
            }
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