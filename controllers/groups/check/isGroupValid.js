const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ groupID }) => {
    const res = await prisma.groups.findFirst({
        where: {
            id: groupID,
            isDeleted: false
        }
    })
    return res ? res.id : false
}