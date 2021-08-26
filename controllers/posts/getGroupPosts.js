const { PrismaClient } = require("@prisma/client")
const generateSelect = require("./generateSelect")

const prisma = new PrismaClient()
module.exports = async ({ groupID, userID, index = 0 }) => {
    const data = await prisma.post.findMany({
        where:{
            group:{
                id: groupID,
                isChatGroup: false,
                isDeleted: false,
                members:{
                    some:{
                        member:{
                            id: userID
                        }
                    }
                }
            },
            isDeleted: false,
            isDeletedBySystem: false
        },
        select:{
            ...generateSelect({viewerID: userID})
        },
        take: 10,
        skip: index*10
    })
    return data
}