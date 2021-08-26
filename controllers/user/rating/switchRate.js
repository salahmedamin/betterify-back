const { PrismaClient } = require("@prisma/client");
const isRateable = require("./isRateable");
const prisma = new PrismaClient()

module.exports = async({
    userID,
    canBeRated
})=>{
    const res = await prisma.user.update({
        data:{
            canBeRated
        },
        where:{
            id: userID
        }
    })
    return !res ? {
        error: true
    }
    :
    {
        success: true
    }
}