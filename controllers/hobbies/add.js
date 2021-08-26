const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ userID, hobby }) => {

    const hobbyExists = await prisma.user_hobbies.findFirst({
        where:{
            hobby
        },
        select:{
            id: true,
            users:{
                where:{
                    id: userID
                }
            }
        }
    })

    if(hobbyExists?.users[0]?.id == userID) return {error: true}

    const res = await prisma.user.update({
        where:{
            id: userID
        },
        data:{
            hobby:{
                connectOrCreate:{
                    where:{
                        id: hobbyExists?.id||-1
                    },
                    create:{
                        hobby
                    }
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