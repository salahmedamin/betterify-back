const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ groupID }) => {
    const isPublicGroup = await prisma.groups.findFirst({
        where:{
            id: groupID,
            isPublic: true,
            isDeleted: false,
        }
    })
    return isPublicGroup ? true : false
}