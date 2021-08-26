const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ groupID, userID, checkIsChatGroup = false }) => {
    const res = await prisma.groups.findFirst({
        where: {
            id: groupID,
            isDeleted: false,
            isChatGroup: checkIsChatGroup ? true : undefined,
            members:{
                some:{
                    id: userID
                }
            }
        }
    })
    return res ? true : false
}