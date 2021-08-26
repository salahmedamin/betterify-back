const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ followID }) => {
    
    const res = await prisma.user_to_user_follows.update({
        where:{
            id: followID
        },
        data:{
            isDeleted: true,
            isPending: false
        }
    })
    return res ? {
        success: true
    } : {
        error: true
    }
    
}