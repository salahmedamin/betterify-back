const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ userID, hobbyID, hobby }) => {
    const res = await prisma.user.update({
        where:{
            id: userID
        },
        data:{
            hobby:{
                update:{
                    where:{
                        id:hobbyID
                    },
                    data:{
                        hobby
                    }
                }
            }
        }
    })
    return res ? true : false
}