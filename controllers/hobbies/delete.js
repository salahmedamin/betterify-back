const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ userID, hobbyID }) => {
    const res = await prisma.user.update({
        where:{
            id: userID
        },
        data:{
            hobby:{
                delete:{
                    id:hobbyID
                }
            }
        }
    })
    return res ? true : false
}