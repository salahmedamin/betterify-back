const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ userID, hobbyID, hobby }) => {
    const res = await prisma.user.update({
        where:{
            id: userID
        },
        data:{
            hobby:{
                disconnect:{
                    id: hobbyID
                },
                connectOrCreate:{
                    where:{
                        hobby
                    },
                    create:{
                        hobby
                    }
                },
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