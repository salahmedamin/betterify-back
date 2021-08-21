const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ userID, hobby }) => {
    const res = await prisma.user.update({
        where:{
            id: userID
        },
        data:{
            hobby:{
                create:{
                    hobby
                }
            }
        }
    })
    return res ? true : false
}