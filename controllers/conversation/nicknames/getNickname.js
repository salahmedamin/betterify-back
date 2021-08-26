const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ userID, otherID, groupID = undefined }) => {
    return (await prisma.messages_nicknames.findFirst({
        where: {
            namer: {
                id: userID
            },
            named: {
                id: otherID
            },
            group: {
                id: groupID
            }
        }
    })).name
}