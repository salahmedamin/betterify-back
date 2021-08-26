const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({userID}) => {
    const res = await prisma.user_bio.findMany({
        where:{
            user:{
                id: userID
            }
        }
    })
    return res
}