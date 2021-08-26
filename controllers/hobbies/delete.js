const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ userID, hobbyID }) => {
    const res = await prisma.user.update({
        where:{
            id: userID
        },
        data:{
            hobby:{
                disconnect:{
                    id:hobbyID
                }
            }
        }
    })
    return res ? {
        success: true
    }
    :
    {
        error: true
    }
}