const { PrismaClient } = require("@prisma/client")
const checkBlock = require("../../blocking/checkBlock")


const prisma = new PrismaClient()
module.exports = async ({ userID, followedID, isFromSuggestion = false }) => {
    if(await checkBlock({
        blockedID: userID,
        blockerID: followedID,
        absolute: true
    })) return {
        error: true
    }
    
    const res = await prisma.user.update({
        where:{
            id: userID
        },
        data:{
            follows:{
                create:{
                    followed:{
                        connect:{
                            id: followedID
                        }
                    },
                    isPending: true,
                    isDeleted: false,
                    isFromSuggestion,
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