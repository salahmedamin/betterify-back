const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ userID, postID }) => {
    const res = await prisma.reaction.findFirst({
        where:{
            post:{
                id: postID
            },
            reactor:{
                id: userID
            }
        },
        select:{
            emoji: true
        }
    })

    return res?.emoji
}