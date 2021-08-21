const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({userID, bio,audience:{sex,age}}) => {
    const res = await prisma.user_bio.create({
        data: {
            age,
            sex,
            bio,
            user:{
                connect:{
                    id: userID
                }
            }
        }
    })
    return res
}