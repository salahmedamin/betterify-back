const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ userID }) => {
    const res = await prisma.user_hobbies.findMany({
        where:{
            users:{
                some:{
                    id: userID
                }
            }
        }
    })
    return res
}